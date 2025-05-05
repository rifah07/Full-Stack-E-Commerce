import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import Wishlist from "../../../models/wishlist.model";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const removeFromWishlist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    if (!userId) {
      return next(new UnauthorizedError("Unauthorized"));
    }

    if (!mongoose.isValidObjectId(productId)) {
      return next(new BadRequestError("Invalid product ID"));
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { product: productId } } },
      { new: true }
    ).populate("items.product", "_id name price images");

    if (!wishlist) {
      return next(new NotFoundError("Wishlist not found for this user"));
    }

    res.status(200).json({
      status: "success",
      message: "Product removed from wishlist",
      data: {
        wishlist: wishlist.items,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default removeFromWishlist;