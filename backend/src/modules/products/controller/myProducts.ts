import { Request, Response, NextFunction } from "express";
import catchAsync from "../../../utils/catchAsync";
import Product from "../../../models/product.model";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const myProducts = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query = {
      seller: req.user?.id,
      isDeleted: false,
    };

    const products = await Product.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      status: "success",
      totalProducts,
      page: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit)),
      products,
    });
  }
);

export default myProducts;