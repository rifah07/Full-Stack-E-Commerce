import { Response, NextFunction } from "express";
import Cart from "../../../models/cart.model";
import Order from "../../../models/order.model";
import Product, { IProduct } from "../../../models/product.model";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from "../../../utils/errors";
import {
  processPaypalPayment,
  processStripePayment,
} from "../../../services/paymentService";

import { getProductId, isSameProduct } from "../../../utils/cartItem";

const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));

    const {
      productId,
      quantity: singleQuantity,
      paymentMethodId,
      paymentMethod,
      shippingAddress: providedAddress,
    } = req.body;

    const cart = await Cart.findOne({ buyer: userId }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return next(new NotFoundError("Cart is empty or not found"));
    }

    let orderItems = [];
    let totalPrice = 0;

    if (productId) {
      const cartItem = cart.items.find((item) => {
        return getProductId(item.product) === productId;
      });

      if (!cartItem)
        return next(new NotFoundError("Product not found in cart"));
      if (singleQuantity > cartItem.quantity)
        return next(
          new BadRequestError("Requested quantity exceeds cart quantity")
        );

      const product = cartItem.product as unknown as IProduct;
      if (singleQuantity > product.stock)
        return next(new BadRequestError("Not enough stock for this product"));

      orderItems.push({ product: product._id, quantity: singleQuantity });
      totalPrice = singleQuantity * product.price;
    } else {
      for (const item of cart.items) {
        const product = item.product as unknown as IProduct;
        if (!product || !product._id) {
          continue; // Skip items with invalid products
        }

        if (item.quantity > product.stock) {
          return next(
            new BadRequestError(`Not enough stock for ${product.name}`)
          );
        }

        orderItems.push({ product: product._id, quantity: item.quantity });
        totalPrice += item.quantity * product.price;
      }
    }

    const shippingAddress = providedAddress || cart.defaultShippingAddress;
    if (!shippingAddress) {
      return next(new BadRequestError("Shipping address is required"));
    }

    let paymentStatus: "unpaid" | "paid" = "unpaid";
    if (paymentMethod === "stripe") {
      await processStripePayment(req, totalPrice, next);
      paymentStatus = "paid";
    } else if (paymentMethod === "paypal") {
      await processPaypalPayment(req, totalPrice, next);
      paymentStatus = "paid";
    } else if (paymentMethod === "cod") {
      paymentStatus = "unpaid";
    } else {
      return next(new BadRequestError("Invalid payment method"));
    }

    const order = new Order({
      buyer: userId,
      orderItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
      paymentStatus,
    });

    await order.save();

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    if (productId) {
      const cartItemIndex = cart.items.findIndex(
        (item) => getProductId(item.product) === productId
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

/*
const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));

    const { paymentMethod, shippingAddress: providedAddress } = req.body;

    const cart = await Cart.findOne({ buyer: userId }).populate({
      path: "items.product",
      select: "price stock name",
    });
    if (!cart || cart.items.length === 0) {
      return next(new NotFoundError("Cart is empty or not found"));
    }

    let totalPrice = 0;

    for (const item of cart.items) {
      const product = item.product as IProduct & {
        price: number;
        stock: number;
      };
      if (!product) return next(new NotFoundError(`Product not found`));
      if (item.quantity > product.stock) {
        return next(
          new BadRequestError(`Not enough stock for ${product.name}`)
        );
      }
      totalPrice += item.quantity * product.price;
    }

    const shippingAddress = providedAddress || cart.defaultShippingAddress;
    if (!shippingAddress) {
      return next(new BadRequestError("Shipping address is required"));
    }

    let paymentStatus: "unpaid" | "paid";
    if (paymentMethod === "cod") {
      paymentStatus = "unpaid";
    } else {
      // right now assume online payments are captured here (expand later)
      paymentStatus = "paid";
    }

    const order = new Order({
      buyer: userId,
      orderItems: cart.items.map((item) => ({
        product: (item.product as any).id,
        quantity: item.quantity,
      })),
      totalPrice,
      shippingAddress,
      paymentMethod,
      paymentStatus,
    });

    await order.save();

    for (const item of cart.items) {
      const product = await Product.findById((item.product as any).id);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    cart.items = [];
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

*/

export default createOrder;
