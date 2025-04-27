import { Request, Response, NextFunction } from "express";
import Product from "../../../models/product.model";
import catchAsync from "../../../utils/catchAsync";
import { NotFoundError } from "../../../utils/errors";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const deleteProduct = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError("Product not found.");
    }

    await product.deleteOne();

    res.status(200).json({
      status: "Product deleted successfully.",
    });
  }
);

export default deleteProduct;