import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import Refund from "../../../models/refund.model";
import { RefundStatus } from "../../../models/order.model";

const getRefundRequests = async (
  req: AuthRequest,
  res: Response,
) => {
  const userId = req.user?.id;
  const isAdmin = req.user?.role === "admin";

  let query = {};
  if (!isAdmin) {
    query = { user: userId };
  }

  const refunds = await Refund.find(query)
    .populate("order", "_id orderItems totalPrice refundStatus")
    .populate("user", "_id name email");

  const statusCounts = refunds.reduce((acc, refund) => {
    acc[refund.refundStatus] = (acc[refund.refundStatus] || 0) + 1;
    return acc;
  }, {} as Record<RefundStatus, number>);

  res.status(200).json({
    status: "success",
    totalRefundRequests: refunds.length,
    statusCounts,
    data: { refunds },
  });
};
export default getRefundRequests;