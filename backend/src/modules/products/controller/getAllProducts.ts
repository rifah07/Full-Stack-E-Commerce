import { Request, Response, NextFunction } from "express";
import Product from "../../../models/product.model";
import catchAsync from "../../../utils/catchAsync";

const getAllProducts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find({isDeleted: false }); //remove soft deleted products

    res.status(200).json({
      status: "Success",
      totalProducts: products.length,
      products,
    });
  }
);

export default getAllProducts;