import { Request, Response, NextFunction } from "express";
import Product from "../../../models/product.model";
import catchAsync from "../../../utils/catchAsync";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const getAllProducts = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const products = await Product.find(); 
    res.status(200).json({
      status: "Success",
      totalProducts: products.length,
      products,
    });
  }
);

export default getAllProducts;
