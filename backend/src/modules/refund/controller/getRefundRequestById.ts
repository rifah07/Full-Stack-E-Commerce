import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../../../utils/errors";
import Refund from "../../../models/refund.model";

const getRefundRequestById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refundId } = req.params;

    if (!mongoose.isValidObjectId(refundId)) {
      return next(new BadRequestError("Invalid refund ID"));
    }

    const refund = await Refund.findById(refundId)
      .populate("order", "_id orderItems totalPrice")
      .populate("user", "_id name email");

    if (!refund) {
      return next(new NotFoundError("Refund request not found"));
    }

    res.status(200).json({
      status: "success",
      data: { refund },
    });
  } catch (error) {
    next(error);
  }
};
export default getRefundRequestById;
