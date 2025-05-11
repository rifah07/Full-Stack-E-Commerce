import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { BadRequestError } from "../../../utils/errors";
import Review from "../../../models/review.model";
import Product from "../../../models/product.model";

const getProductReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!isValidObjectId(productId)) {
      return next(new BadRequestError("Invalid product ID"));
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ product: productId });
    const totalPages = Math.ceil(totalReviews / limit);

    res.status(200).json({
      status: "success",
      data: {
        reviews,
        totalReviews,
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getProductReviews;