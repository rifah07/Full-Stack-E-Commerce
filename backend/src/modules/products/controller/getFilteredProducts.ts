import { Request, Response, NextFunction } from "express";
import Product from "../../../models/product.model";
import catchAsync from "../../../utils/catchAsync";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const getFilteredProducts = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const {
      search,
      category,
      priceMin,
      priceMax,
      page = 1,
      limit = 10,
    } = req.body;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = {};

    // Admin can view even deleted
    if (req.user?.role !== "admin") {
      query.isDeleted = false;
    }

    // Search by product name
    if (search) {
      query.name = { $regex: search, $options: "i" }; // case-insensitive search
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // Newest first

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      status: "Success",
      totalProducts,
      page: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit)),
      products,
    });
  }
);

export default getFilteredProducts;
