import { Response, NextFunction } from "express";
import Cart from "../../../models/cart.model";
import Order from "../../../models/order.model";
import User from "../../../models/user.model";
import Product, { IProduct } from "../../../models/product.model";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import { isValidObjectId, Types } from "mongoose";
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from "../../../utils/errors";
import {
  processPaypalPayment,
  processStripePayment,
} from "../../../services/paymentService";
import Coupon, { CouponStatus } from "../../../models/coupon.model";

// new interface for direct order items
interface DirectOrderItem {
  productId: string;
  quantity: number;
}

const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  if (!userId) return next(new UnauthorizedError("Unauthorized"));

  const user = await User.findById(userId);
  if (!user) return next(new NotFoundError("User not found"));

  const {
    // Cart-based order properties
    product: productIdFromBody,
    quantity: singleQuantity,

    // Direct order properties
    products: directOrderItems,

    // Common properties
    paymentMethodId,
    paymentMethod,
    shippingAddress: providedAddress,
    couponCode,
    useCart = true, // a flag to determine if we should use cart or direct order
  } = req.body;

  let orderItems: {
    product: Types.ObjectId;
    quantity: number;
    seller: Types.ObjectId; // ADDED SELLER HERE
  }[] = [];
  let totalPriceBeforeDiscount = 0;
  let appliedCoupon: any = null;
  let discountAmount = 0;
  let finalPrice = 0;

  let shippingAddress = providedAddress;

  // Process cart-based order
  if (useCart) {
    const cart = await Cart.findOne({ buyer: userId }).populate({
      path: "items.product",
      model: "Product",
      select: "_id name price stock imageUrl seller", // Include seller in population
    });

    if (!cart || cart.items.length === 0) {
      if (!directOrderItems) {
        return next(
          new NotFoundError(
            "Cart is empty or not found and no direct order items provided"
          )
        );
      }
      // If cart is empty but we have direct order items, continue with direct order
    } else {
      // For cart orders, use cart's default address if no address provided
      if (!shippingAddress && cart.defaultShippingAddress) {
        shippingAddress = cart.defaultShippingAddress;
      }

      if (productIdFromBody) {
        // Single product from cart
        const cartItem = cart.items.find(
          (item: any) =>
            item.product &&
            isValidObjectId(item.product._id) &&
            String(item.product._id) === String(productIdFromBody)
        );

        if (!cartItem) {
          return next(new NotFoundError("Product not found in cart"));
        }

        if (singleQuantity > cartItem.quantity) {
          return next(
            new BadRequestError("Requested quantity exceeds cart quantity")
          );
        }

        const product = cartItem.product as IProduct;
        if (!product || !product._id) {
          return next(new NotFoundError("Product details missing"));
        }

        if (singleQuantity > product.stock) {
          return next(new BadRequestError("Not enough stock for this product"));
        }

        orderItems.push({
          product: new Types.ObjectId(String(product._id)),
          quantity: singleQuantity,
          seller: product.seller, // ADDED SELLER HERE
        });
        totalPriceBeforeDiscount = singleQuantity * product.price;
      } else if (!directOrderItems) {
        // all items from cart
        for (const item of cart.items) {
          const product = item.product as IProduct;
          if (!product || !product._id) continue;

          if (item.quantity > product.stock) {
            return next(
              new BadRequestError(`Not enough stock for ${product.name}`)
            );
          }

          orderItems.push({
            product: new Types.ObjectId(String(product._id)),
            quantity: item.quantity,
            seller: product.seller, // ADDED SELLER HERE
          });
          totalPriceBeforeDiscount += item.quantity * product.price;
        }
      }
    }
  }

  // process direct order items (either instead of cart or in addition to it)
  if (directOrderItems && Array.isArray(directOrderItems)) {
    for (const item of directOrderItems) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return next(new BadRequestError("Invalid product data in order"));
      }

      if (!isValidObjectId(item.productId)) {
        return next(
          new BadRequestError(`Invalid product ID: ${item.productId}`)
        );
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return next(
          new NotFoundError(`Product with ID ${item.productId} not found`)
        );
      }

      if (item.quantity > product.stock) {
        return next(
          new BadRequestError(`Not enough stock for ${product.name}`)
        );
      }

      // check if product already exists in orderItems (from cart)
      const existingItemIndex = orderItems.findIndex(
        (orderItem) => String(orderItem.product) === String(product._id)
      );

      if (existingItemIndex !== -1) {
        // update quantity if product already in orderItems
        const newQuantity =
          orderItems[existingItemIndex].quantity + item.quantity;
        if (newQuantity > product.stock) {
          return next(
            new BadRequestError(`Not enough stock for ${product.name}`)
          );
        }
        orderItems[existingItemIndex].quantity = newQuantity;
      } else {
        // add new product to orderItems
        orderItems.push({
          product: new Types.ObjectId(String(product._id)),
          quantity: item.quantity,
          seller: product.seller, // ADDED SELLER HERE
        });
      }

      totalPriceBeforeDiscount += item.quantity * product.price;
    }
  }

  // Ensure we have items to order
  if (orderItems.length === 0) {
    return next(new BadRequestError("No valid items to order"));
  }

  // If shipping address is not provided in the request and not found in the cart,
  // use the user's address as a fallback
  if (!shippingAddress && user.address) {
    shippingAddress = user.address;
  }

  // Final shipping address validation
  if (!shippingAddress) {
    return next(
      new BadRequestError(
        "Shipping address is required. Please provide an address or update your account with a default address."
      )
    );
  }

  // Ensure address is not empty string
  if (
    typeof shippingAddress === "string" &&
    (!shippingAddress.trim() || shippingAddress === "No address provided")
  ) {
    return next(
      new BadRequestError(
        "A valid shipping address is required. Please provide an address."
      )
    );
  }

  // Process coupon if provided
  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      status: CouponStatus.ACTIVE,
    });

    if (coupon) {
      const now = new Date();
      if (coupon.expiresAt && now > coupon.expiresAt) {
        return next(new BadRequestError("Coupon has expired"));
      }

      if (
        coupon.minOrderValue &&
        totalPriceBeforeDiscount < coupon.minOrderValue
      ) {
        return next(
          new BadRequestError(
            `Minimum order value for this coupon is ${coupon.minOrderValue}`
          )
        );
      }

      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return next(new BadRequestError("Coupon usage limit reached"));
      }

      appliedCoupon = coupon;

      if (coupon.type === "percentage") {
        discountAmount = totalPriceBeforeDiscount * (coupon.value / 100);
      } else if (coupon.type === "fixed") {
        discountAmount = coupon.value;
      }

      discountAmount = Math.min(discountAmount, totalPriceBeforeDiscount);
    } else {
      console.log(`Coupon code "${couponCode}" is invalid or not active.`);
    }
  }

  finalPrice = totalPriceBeforeDiscount - discountAmount;

  // Process payment
  let paymentStatus: "unpaid" | "paid" = "unpaid";

  if (paymentMethod === "stripe") {
    const paymentResult = await processStripePayment(
      finalPrice,
      paymentMethodId,
      next
    );
    if (!paymentResult) return;
    paymentStatus = "paid";
  } else if (paymentMethod === "paypal") {
    const paymentResult = await processPaypalPayment(finalPrice, next);
    if (!paymentResult) return;
    paymentStatus = "paid";
  } else if (paymentMethod === "cod") {
    paymentStatus = "unpaid";
  } else {
    return next(new BadRequestError("Invalid payment method"));
  }

  // create order
  const order = new Order({
    buyer: userId,
    orderItems,
    totalPrice: totalPriceBeforeDiscount,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    couponCode: appliedCoupon?.code,
    discountAmount,
    finalPrice,
  });

  await order.save();

  // update coupon usage if applied
  if (appliedCoupon) {
    appliedCoupon.usageCount += 1;
    await appliedCoupon.save();
  }

  // update product stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock -= item.quantity;
      await product.save();
    }
  }

  // Update cart if using cart
  if (useCart) {
    const cart = await Cart.findOne({ buyer: userId });
    if (cart) {
      if (productIdFromBody) {
        // remove single product
        const cartItemIndex = cart.items.findIndex(
          (item: any) =>
            item.product &&
            isValidObjectId(item.product._id) &&
            String(item.product._id) === String(productIdFromBody)
        );
        if (cartItemIndex !== -1) {
          const item = cart.items[cartItemIndex];
          if (item.quantity <= singleQuantity) {
            cart.items.splice(cartItemIndex, 1);
          } else {
            item.quantity -= singleQuantity;
          }
        }
      } else if (!directOrderItems) {
        // clear entire cart
        cart.items = [];
      } else {
        // remove only the products that were ordered directly
        const productIdsToRemove = directOrderItems.map(
          (item: DirectOrderItem) => item.productId
        );
        for (const productId of productIdsToRemove) {
          const cartItemIndex = cart.items.findIndex(
            (item: any) => String(item.product) === String(productId)
          );
          if (cartItemIndex !== -1) {
            const directItem = directOrderItems.find(
              (item: DirectOrderItem) =>
                String(item.productId) === String(productId)
            );
            const cartItem = cart.items[cartItemIndex];
            if (cartItem.quantity <= directItem.quantity) {
              cart.items.splice(cartItemIndex, 1);
            } else {
              cartItem.quantity -= directItem.quantity;
            }
          }
        }
      }
      await cart.save();
    }
  }

  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: order,
  });
};

export default createOrder;