import { Request, Response, NextFunction } from "express";
import Product from "../../../models/product.model";
import catchAsync from "../../../utils/catchAsync";
import { NotFoundError } from "../../../utils/errors";

const getSingleProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError("Product not found.");
    }

    res.status(200).json({
      status: "Success",
      product,
    });
  }
);

export default getSingleProduct;