import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import { isValidObjectId } from "mongoose";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";
import Review from "../../../models/review.model";

const updateReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    if (!isValidObjectId(productId) || !isValidObjectId(reviewId)) {
      return next(new BadRequestError("Invalid product ID or review ID"));
    }

    if (
      rating !== undefined &&
      (typeof rating !== "number" || rating < 1 || rating > 5)
    ) {
      return next(
        new BadRequestError("Rating must be a number between 1 and 5")
      );
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(new NotFoundError("Review not found"));
    }

    if (String(review.user) !== userId) {
      return next(
        new UnauthorizedError("You are not authorized to update this review")
      );
    }

    review.rating = rating !== undefined ? rating : review.rating;
    review.comment = comment !== undefined ? comment : review.comment;
    const updatedReview = await review.save();

    res.status(200).json({
      status: "success",
      data: { review: updatedReview },
      message: "Review updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default updateReview;