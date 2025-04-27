import { Request, Response, NextFunction } from "express";
import Product from "../../../models/product.model";
import catchAsync from "../../../utils/catchAsync";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import { createProductSchema } from "../../../validators/product.validator";


const createProduct = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const parsedData = createProductSchema.parse({ body: req.body });

    const { name, description, price, category, stock, images } = parsedData.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images,
      seller: req.user?.id, // Only logged in users can create
    });

    res.status(201).json({
      status: "Product created successfully.",
      data: product,
    });
  }
);

export default createProduct;
