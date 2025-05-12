import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import { UnauthorizedError } from "../../../utils/errors";
import Coupon from "../../../models/coupon.model";

const getSellerCoupons = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId || req.user?.role !== "seller") {
      return next(new UnauthorizedError("Seller access required."));
    }

    const now = new Date();
    const coupons = await Coupon.find({ seller: sellerId }).sort({
      createdAt: -1,
    });

    const couponsWithStatus = coupons.map((coupon) => ({
      ...coupon.toObject(),
      isActive: !coupon.expiresAt || now < coupon.expiresAt,
      isExpired: coupon.expiresAt && now >= coupon.expiresAt,
    }));

    res.status(200).json({
      status: "success",
      data: { coupons: couponsWithStatus },
    });
  } catch (error) {
    next(error);
  }
};

export default getSellerCoupons;