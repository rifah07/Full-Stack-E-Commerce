import { Request, Response, NextFunction } from "express";
import Wishlist from "../../../models/wishlist.model";
import { UnauthorizedError } from "../../../utils/errors";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const getUserWishlist = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new UnauthorizedError("Unauthorized"));
    }

    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "items.product",
      "_id name price images"
    );

    const wishlistItems = wishlist ? wishlist.items : [];
    const totalItems = wishlistItems.length;

    res.status(200).json({
      status: "success",
      totalItems: totalItems,
      data: {
        items: wishlistItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getUserWishlist;