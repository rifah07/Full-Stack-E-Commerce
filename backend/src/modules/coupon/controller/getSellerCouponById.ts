import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";
import { isValidObjectId } from "mongoose";
import Coupon from "../../../models/coupon.model";

const getSellerCouponById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sellerId = req.user?.id;
    const { couponId } = req.params;

    if (!sellerId || req.user?.role !== "seller") {
      return next(new UnauthorizedError("Seller access required."));
    }

    if (!isValidObjectId(couponId)) {
      return next(new BadRequestError("Invalid coupon ID."));
    }

    const coupon = await Coupon.findOne({ _id: couponId, seller: sellerId });
    if (!coupon) {
      return next(
        new NotFoundError("Coupon not found or does not belong to this seller.")
      );
    }

    const now = new Date();
    const couponWithStatus = {
      ...coupon.toObject(),
      isActive: !coupon.expiresAt || now < coupon.expiresAt,
      isExpired: coupon.expiresAt && now >= coupon.expiresAt,
    };

    res.status(200).json({
      status: "success",
      data: { coupon: couponWithStatus },
    });
  } catch (error) {
    next(error);
  }
};

export default getSellerCouponById;
