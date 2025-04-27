import { Request, Response, NextFunction } from "express";
import Product from "../../../models/product.model";
import catchAsync from "../../../utils/catchAsync";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const updateProduct = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const productId = req.params.productId;
    const userId = req.user?.id;

    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError("Product not found.");
    }

    if (product.seller.toString() !== userId) {
      throw new ForbiddenError("You are not authorized to update this product.");
    }

    // Update allowed fields
    const updatableFields = ["name", "description", "price", "category", "stock", "images"];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        (product as any)[field] = req.body[field];
      }
    });

    await product.save();

    res.status(200).json({
      status: "Product updated successfully.",
      product,
    });
  }
);

export default updateProduct;