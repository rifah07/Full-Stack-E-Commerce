import mongoose from "mongoose";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import Order, { RefundStatus } from "../../../models/order.model";
import Refund from "../../../models/refund.model";
import { BadRequestError, NotFoundError } from "../../../utils/errors";

const updateRefundStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refundId } = req.params;
    const { refundStatus } = req.body;
    const adminId = req.user?.id;

    if (!mongoose.isValidObjectId(refundId)) {
      return next(new BadRequestError("Invalid refund ID"));
    }

    if (!refundStatus || !Object.values(RefundStatus).includes(refundStatus)) {
      return next(
        new BadRequestError(
          `Invalid refund status. Allowed statuses: ${Object.values(
            RefundStatus
          ).join(", ")}`
        )
      );
    }

    const refund = await Refund.findById(refundId);
    if (!refund) {
      return next(new NotFoundError("Refund request not found"));
    }

    if (refund.refundStatus === RefundStatus.REFUNDED) {
      return next(
        new BadRequestError(
          "This refund request has already been processed and refunded."
        )
      );
    }

    const updatedRefund = await Refund.findByIdAndUpdate(
      refundId,
      { refundStatus, processedAt: new Date(), processedBy: adminId },
      { new: true }
    );

    if (!updatedRefund) {
      return next(new NotFoundError("Failed to update refund status"));
    }

    // Update the order's refund status accordingly
    const orderRefundStatus =
    refundStatus === RefundStatus.REFUNDED ? RefundStatus.REFUNDED : refundStatus;
    await Order.findByIdAndUpdate(refund.order, {
      refundStatus: orderRefundStatus,
    });

    // trigger payment gateway refund logic here
    if (refundStatus === RefundStatus.APPROVED) {
      // Logic to initiate refund with Stripe, PayPal.
      console.log(
        `Initiating refund for order ${refund.order} with amount ${refund.refundAmount}`
      );
      // This part requires integration with payment gateway's API
    }

    res.status(200).json({
      status: "success",
      message: `Refund request updated to ${refundStatus}`,
      data: { refund: updatedRefund },
    });
  } catch (error) {
    next(error);
  }
};

export default updateRefundStatus;