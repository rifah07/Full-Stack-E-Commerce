import { AuthRequest } from "../../../middlewares/authMiddleware";
import { Response, NextFunction } from "express";
import Order from "../../../models/order.model";
import { NotFoundError, BadRequestError } from "../../../utils/errors";

const cancelOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, buyer: userId });
    if (!order) return next(new NotFoundError("Order not found"));

    if (order.status !== "pending") {
      return next(new BadRequestError("Only pending orders can be cancelled"));
    }

    // If already paid, mark refund (can be added later plug real refund API here, In Sha Allah)
    if (order.paymentStatus === "paid") {
      order.paymentStatus = "refunded";
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      status: "success",
      message: "Order cancelled and refund processed (if applicable)",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export default cancelOrder;