import { Response, NextFunction } from "express";
import Cart from "../../../models/cart.model";
import Order from "../../../models/order.model";
import Product from "../../../models/product.model";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import { NotFoundError, UnauthorizedError, BadRequestError } from "../../../utils/errors";
import { IProduct } from "../../../models/product.model";

const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));

    const cart = await Cart.findOne({ buyer: userId }).populate({
      path: "items.product",
      select: "price stock",
    });
    if (!cart) return next(new NotFoundError("Cart not found"));

    let totalPrice = 0;

    // Check stock availability and calculate total price
    for (const item of cart.items) {
      const product = item.product as IProduct & { price: number; stock: number };

      if (!product) {
        return next(new NotFoundError(`Product not found in cart`));
      }

      if (item.quantity > product.stock) {
        return next(new BadRequestError(`Not enough stock for product: ${product.name}`));
      }

      totalPrice += item.quantity * product.price;
    }

    const shippingAddress =
      cart.defaultShippingAddress || req.body.shippingAddress;
    if (!shippingAddress) {
      return next(
        new NotFoundError("No shipping address provided or saved in cart")
      );
    }

    const order = new Order({
      buyer: userId,
      orderItems: cart.items.map((item) => ({
        product: (item.product as any).id, // store only ID
        quantity: item.quantity,
      })),
      totalPrice,
      shippingAddress,
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