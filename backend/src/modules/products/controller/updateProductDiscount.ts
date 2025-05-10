import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import Product from "../../../models/product.model";
import User from "../../../models/user.model";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";

const updateProductDiscount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { type, value } = req.body;
    const userId = req.user?.id;
    const user = await User.findById(userId);

    if (!isValidObjectId(productId)) {
      return next(new BadRequestError("Invalid product ID"));
    }

    if (type && !["percentage", "fixed"].includes(type)) {
      return next(new BadRequestError("Invalid discount type"));
    }

    if (value !== undefined && (typeof value !== "number" || value < 0)) {
      return next(
        new BadRequestError("Discount value must be a non-negative number")
      );
    }

    const updateData: { discount?: { type: string; value: number } | null } =
      {};
    if (type && value !== undefined) {
      updateData.discount = { type, value };
    } else if (value === null) {
      updateData.discount = null; // To remove discount
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new NotFoundError("Product not found"));
    }

    // Check if the user is a seller and owns the product
    if (user?.role === "seller" && String(product.seller) !== userId) {
      return next(
        new UnauthorizedError(
          "You are not authorized to update this product's discount"
        )
      );
    }
    // Admins can update any product
    else if (user?.role !== "admin" && String(product.seller) !== userId) {
      return next(
        new UnauthorizedError(
          "You are not authorized to update this product's discount"
        )
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    if (updatedProduct) {
      res.status(200).json({
        status: "success",
        data: { product: updatedProduct },
        message: "Product discount updated successfully",
      });
    } else {
      res.status(404).json({ status: "failed", message: "Product not found" });
    }
  } catch (error) {
    next(error);
  }
};

export default updateProductDiscount;