import { Request, Response, NextFunction } from "express";
import Coupon from "../../../models/coupon.model";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const createCoupon = async (req: AuthRequest, res: Response) => {
  const newCoupon = new Coupon(req.body);
  await newCoupon.save();
  res.status(201).json({
    status: "success",
    data: { coupon: newCoupon },
  });
};

export default createCoupon;
