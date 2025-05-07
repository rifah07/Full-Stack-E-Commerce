import { Response, NextFunction } from "express";
import Cart from "../../../models/cart.model";
import Order from "../../../models/order.model";
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

const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));
    const {
      product: productIdFromBody,
      quantity: singleQuantity,
      paymentMethodId,
      paymentMethod,
      shippingAddress: providedAddress,
      couponCode,
    } = req.body;

    const cart = await Cart.findOne({ buyer: userId }).populate({
      path: "items.product",
      model: "Product",
      select: "_id name price stock imageUrl",
    });

    if (!cart || cart.items.length === 0) {
      return next(new NotFoundError("Cart is empty or not found"));
    }

    let orderItems: { product: Types.ObjectId; quantity: number }[] = [];
    let totalPriceBeforeDiscount = 0;
    let appliedCoupon: any = null;
    let discountAmount = 0;
    let finalPrice = 0;

    if (productIdFromBody) {
      const cartItem = cart.items.find(
        (item: any) =>
          item.product &&
          isValidObjectId(item.product._id) &&
          String(item.product._id) === String(productIdFromBody)
      );

      if (!cartItem)
        return next(new NotFoundError("Product not found in cart"));
      if (singleQuantity > cartItem.quantity)
        return next(
          new BadRequestError("Requested quantity exceeds cart quantity")
        );

      const product = cartItem.product as IProduct;
      if (!product || !product._id)
        return next(new NotFoundError("Product details missing"));
      if (singleQuantity > product.stock)
        return next(new BadRequestError("Not enough stock for this product"));

      orderItems.push({
        product: new Types.ObjectId(String(product._id)),
        quantity: singleQuantity,
      });
      totalPriceBeforeDiscount = singleQuantity * product.price;
    } else {
      for (const item of cart.items) {
        const product = item.product as IProduct;
        if (!product || !product._id) continue;
        if (item.quantity > product.stock)
          return next(
            new BadRequestError(`Not enough stock for ${product.name}`)
          );
        orderItems.push({
          product: new Types.ObjectId(String(product._id)),
          quantity: item.quantity,
        });
        totalPriceBeforeDiscount += item.quantity * product.price;
      }
    }

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

    const shippingAddress = providedAddress || cart.defaultShippingAddress;
    if (!shippingAddress) {
      return next(new BadRequestError("Shipping address is required"));
    }

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

    const order = new Order({
      buyer: userId,
      orderItems,
      totalPrice: totalPriceBeforeDiscount, // save original total
      shippingAddress,
      paymentMethod,
      paymentStatus,
      couponCode: appliedCoupon?.code,
      discountAmount,
      finalPrice,
    });

    await order.save();

    if (appliedCoupon) {
      appliedCoupon.usageCount += 1;
      await appliedCoupon.save();
    }

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    if (productIdFromBody) {
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
    } else {
      cart.items = [];
    }

    await cart.save();

    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export default createOrder;
