import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";
import { isValidObjectId } from "mongoose";
import Coupon from "../../../models/coupon.model";

const updateSellerCoupon = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sellerId = req.user?.id;
    const { couponId } = req.params;
    const updateData = req.body;

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

    // prevent sellers from changing the coupon code or seller association
    delete updateData.code;
    delete updateData.seller;
    delete updateData.usageCount;

    if (
      updateData.expiresAt &&
      isNaN(new Date(updateData.expiresAt).getTime())
    ) {
      return next(new BadRequestError("Invalid expiration date format."));
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: { coupon: updatedCoupon },
      message: "Coupon updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export default updateSellerCoupon;