import { Request, Response, NextFunction } from "express";
import Wishlist from "../../../models/wishlist.model";
import { BadRequestError, UnauthorizedError } from "../../../utils/errors";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const addToWishlist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    if (!userId) {
      return next(new UnauthorizedError("Unauthorized"));
    }

    if (!productId) {
      return next(new BadRequestError("Product ID is required"));
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $addToSet: { items: { product: productId } } },
      { upsert: true, new: true }
    ).populate("items.product", "_id name price images");

    res.status(200).json({
      status: "success",
      message: "Product added to wishlist",
      data: {
        wishlist: wishlist.items,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default addToWishlist;
