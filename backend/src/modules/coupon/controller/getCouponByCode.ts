import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import Coupon from "../../../models/coupon.model";
import { NotFoundError } from "../../../utils/errors";

const getCouponByCode = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.params;
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) {
    throw new NotFoundError("Coupon not found");
  }
  res.status(200).json({
    status: "success",
    data: { coupon },
  });
};

export default getCouponByCode;