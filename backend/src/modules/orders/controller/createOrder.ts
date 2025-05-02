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

export default createOrder;
