import { Request, Response, NextFunction } from "express";
import Product from "../../../models/product.model";
import catchAsync from "../../../utils/catchAsync";
import { ForbiddenError, NotFoundError } from "../../../utils/errors";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const restoreProduct = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { productId } = req.params;

    if (!req.user) {
      throw new ForbiddenError("Authentication required");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (!product.isDeleted) {
      throw new ForbiddenError("Product is not in trash");
    }

    if (
      req.user.role !== "admin" &&
      product.seller.toString() !== req.user.id
    ) {
      throw new ForbiddenError("You can only restore your own products");
    }

    product.isDeleted = false;
    await product.save();

    res.status(200).json({
      message: "Product restored successfully",
      data: product,
    });
  }
);

export default restoreProduct;
