import { AuthRequest } from "../../../middlewares/authMiddleware";
import { Request, Response, NextFunction } from "express";
import Refund, { RefundStatus } from "../../../models/refund.model";
import Order from "../../../models/order.model";
import mongoose from "mongoose";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";

const requestRefund = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!userId) {
      return next(new UnauthorizedError("Unauthorized"));
    }

    if (!mongoose.isValidObjectId(orderId)) {
      return next(new BadRequestError("Invalid order ID"));
    }

    if (!reason) {
      return next(new BadRequestError("Reason for refund is required"));
    }

    const order = await Order.findById(orderId);
    if (!order || order.buyer.toString() !== userId) {
      return next(
        new NotFoundError("Order not found or does not belong to this user")
      );
    }

    // Prevent duplicate refund requests for the same order in pending state
    const existingRefundRequest = await Refund.findOne({
      order: orderId,
      user: userId,
      status: RefundStatus.PENDING,
    });
    if (existingRefundRequest) {
      return next(
        new BadRequestError(
          "A pending refund request already exists for this order"
        )
      );
    }

    // Determine the refund amount
    const refundAmount = order.totalPrice; // for simplicity, refunding the full amount

    const newRefund = new Refund({
      order: orderId,
      user: userId,
      reason,
      refundAmount,
    });

    await newRefund.save();

    // Update the order's refund status to pending
    await Order.findByIdAndUpdate(orderId, {
      refundStatus: RefundStatus.PENDING,
    });

    res.status(201).json({
      status: "success",
      message: "Refund request submitted successfully",
      data: { refund: newRefund },
    });
  } catch (error) {
    next(error);
  }
};
export default requestRefund;
