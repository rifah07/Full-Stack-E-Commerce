import { Request, Response, NextFunction } from "express";
import { BadRequestError, NotFoundError } from "../../../utils/errors";
import { isValidObjectId, Types } from "mongoose";
import Product from "../../../models/product.model";

const getProductQA = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return next(new BadRequestError("Invalid product ID."));
    }

    const product = await Product.findById(productId).populate(
      "questionsAndAnswers.user",
      "firstName lastName"
    );

    if (!product) {
      return next(new NotFoundError("Product not found."));
    }

    res.status(200).json({
      status: "success",
      data: { qa: product.questionsAndAnswers },
    });
  } catch (error) {
    next(error);
  }
};

export default getProductQA;