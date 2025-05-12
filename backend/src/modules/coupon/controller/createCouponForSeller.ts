import { Request, Response, NextFunction } from "express";
import Coupon from "../../../models/coupon.model";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import { BadRequestError, UnauthorizedError } from "../../../utils/errors";

const createCouponForSeller = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sellerId = req.user?.id;
    const userRole = req.user?.role;

    if (!sellerId || userRole !== "seller") {
      return next(
        new UnauthorizedError(
          "You are not authorized to create coupons as a seller."
        )
      );
    }

    const {
      code,
      type,
      value,
      expiresAt,
      minOrderValue,
      usageCount,
      productSpecific,
      products,
      categorySpecific,
      categories,
    } = req.body;

    if (!code || !type || value === undefined) {
      return next(
        new BadRequestError("Coupon code, type, and value are required.")
      );
    }

    if (!["percentage", "fixed"].includes(type)) {
      return next(
        new BadRequestError(
          "Invalid coupon type. Must be 'percentage' or 'fixed'."
        )
      );
    }

    if (typeof value !== "number" || value <= 0) {
      return next(
        new BadRequestError("Coupon value must be a positive number.")
      );
    }

    if (expiresAt && isNaN(new Date(expiresAt).getTime())) {
      return next(new BadRequestError("Invalid expiration date format."));
    }

    if (
      minOrderValue !== undefined &&
      (typeof minOrderValue !== "number" || minOrderValue < 0)
    ) {
      return next(
        new BadRequestError(
          "Minimum order value must be a non-negative number."
        )
      );
    }

    if (
      usageCount !== undefined &&
      (typeof usageCount !== "number" || usageCount <= 0)
    ) {
      return next(
        new BadRequestError("Usage limit must be a positive number.")
      );
    }

    if (
      productSpecific &&
      (!Array.isArray(products) || products.length === 0)
    ) {
      return next(
        new BadRequestError(
          "Product IDs are required for product-specific coupons."
        )
      );
    }

    if (
      categorySpecific &&
      (!Array.isArray(categories) || categories.length === 0)
    ) {
      return next(
        new BadRequestError(
          "Category IDs are required for category-specific coupons."
        )
      );
    }

    const newCoupon = new Coupon({
      code: code.toUpperCase(),
      type,
      value,
      expiresAt,
      minOrderValue,
      usageCount,
      seller: sellerId,
      productSpecific,
      products: productSpecific ? products : [],
      categorySpecific,
      categories: categorySpecific ? categories : [],
    });

    await newCoupon.save();

    res.status(201).json({
      status: "success",
      data: { coupon: newCoupon },
      message: "Coupon created successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export default createCouponForSeller;