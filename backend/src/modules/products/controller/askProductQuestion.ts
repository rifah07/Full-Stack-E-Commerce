import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";
import { isValidObjectId, Types } from "mongoose";
import Product from "../../../models/product.model";

const askProductQuestion = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { question } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(
        new UnauthorizedError("You must be logged in to ask a question.")
      );
    }

    if (!isValidObjectId(productId)) {
      return next(new BadRequestError("Invalid product ID."));
    }

    if (!question || question.trim() === "") {
      return next(new BadRequestError("Question cannot be empty."));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new NotFoundError("Product not found."));
    }

    const sellerId = product.seller;

    product.questionsAndAnswers.push({
      question: question.trim(),
      user: new Types.ObjectId(userId),
      seller: sellerId,
    } as any); // Type 'any' to match the embedded schema

    await product.save();

    res.status(201).json({
      status: "success",
      message: "Question submitted successfully.",
      data: { question: product.questionsAndAnswers.slice(-1)[0] },
    });
  } catch (error) {
    next(error);
  }
};

export default askProductQuestion;