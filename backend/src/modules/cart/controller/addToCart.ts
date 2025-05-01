import mongoose from "mongoose";
import { Response, NextFunction } from "express";
import Cart from "../../../models/cart.model";
import Product from "../../../models/product.model";
import User from "../../../models/user.model";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from "../../../utils/errors";
import { AuthRequest } from "../../../middlewares/authMiddleware";

export const addToCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));

    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return next(new BadRequestError("Product ID and quantity are required"));
    }

    const product = await Product.findById(productId);
    if (!product) return next(new NotFoundError("Product not found"));

    let cart = await Cart.findOne({ buyer: userId });

    if (!cart) {
      const user = await User.findById(userId);
      if (!user) return next(new NotFoundError("User not found"));

      if (quantity > product.stock) {
        return next(
          new BadRequestError(`Only ${product.stock} items in stock`)
        );
      }

      cart = new Cart({
        buyer: userId,
        items: [{ product: new mongoose.Types.ObjectId(productId), quantity }],
        defaultShippingAddress:
          req.body.shippingAddress || user.address || "No address provided",
      });
    } else {
      const itemIndex = cart.items.findIndex((item) => {
        const productIdStr =
          item.product instanceof mongoose.Types.ObjectId
            ? item.product.toString()
            : String(item.product);
        return productIdStr === productId;
      });

      if (itemIndex > -1) {
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        if (newQuantity > product.stock) {
          return next(
            new BadRequestError(`Only ${product.stock} items in stock`)
          );
        }
        cart.items[itemIndex].quantity = newQuantity;
      } else {
        if (quantity > product.stock) {
          return next(
            new BadRequestError(`Only ${product.stock} items in stock`)
          );
        }
        cart.items.push({
          product: new mongoose.Types.ObjectId(productId),
          quantity,
        });
      }
    }

    await cart.save();
    res.status(200).json({
      status: "success",
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    next(error);
  }
};
