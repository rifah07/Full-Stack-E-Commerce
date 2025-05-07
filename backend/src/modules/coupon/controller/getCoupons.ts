import { Request, Response, NextFunction } from "express";
import Coupon from "../../../models/coupon.model";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const getCoupons = async (req: AuthRequest, res: Response) => {
  const coupons = await Coupon.find();
  const totalCoupons = coupons.length;

  res.status(200).json({
    status: "success",
    data: {
      coupons,
      totalCoupons,
    },
  });
};

export default getCoupons;