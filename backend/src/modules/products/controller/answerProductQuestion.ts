import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";
import { isValidObjectId, Types } from "mongoose";
import Product from "../../../models/product.model";

const answerProductQuestion = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, questionId } = req.params;
    const { answer } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return next(
        new UnauthorizedError("You must be logged in to answer questions.")
      );
    }

    if (!isValidObjectId(productId) || !isValidObjectId(questionId)) {
      return next(new BadRequestError("Invalid product ID or question ID."));
    }

    if (!answer || answer.trim() === "") {
      return next(new BadRequestError("Answer cannot be empty."));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new NotFoundError("Product not found."));
    }

    const questionIndex = product.questionsAndAnswers.findIndex(
        (qa) => qa._id?.toString() === questionId
      );
      
      if (questionIndex === -1) {
        return next(new NotFoundError("Question not found."));
      }

    const isSeller = product.seller?.toString() === userId;
    const isAdmin = userRole === "admin";

    if (!isSeller && !isAdmin) {
      return next(
        new UnauthorizedError(
          "Only the seller of this product or an admin can answer this question."
        )
      );
    }

    product.questionsAndAnswers[questionIndex].answer = answer.trim();
    await product.save();

    res.status(200).json({
      status: "success",
      message: "Question answered successfully.",
      data: { question: product.questionsAndAnswers[questionIndex] },
    });
  } catch (error) {
    next(error);
  }
};

export default answerProductQuestion;
