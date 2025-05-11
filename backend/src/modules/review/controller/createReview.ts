import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import Product from "../../../models/product.model";
import Review from "../../../models/review.model";
import { BadRequestError, NotFoundError } from "../../../utils/errors";
import { isValidObjectId } from "mongoose";

const createReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    if (!isValidObjectId(productId)) {
      return next(new BadRequestError("Invalid product ID"));
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return next(
        new BadRequestError("Rating must be a number between 1 and 5")
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new NotFoundError("Product not found"));
    }

    // check if the user has already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });
    if (existingReview) {
      return next(
        new BadRequestError("You have already reviewed this product")
      );
    }

    const newReview = new Review({
      product: productId,
      user: userId,
      rating,
      comment,
    });

    const savedReview = await newReview.save();

    res.status(201).json({
      status: "success",
      data: { review: savedReview },
      message: "Review submitted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default createReview;