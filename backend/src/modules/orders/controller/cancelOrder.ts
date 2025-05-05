import { AuthRequest } from "../../../middlewares/authMiddleware";
import { Response, NextFunction } from "express";
import Order from "../../../models/order.model";
import Product from "../../../models/product.model";
import { NotFoundError, BadRequestError } from "../../../utils/errors";

const cancelOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, buyer: userId }).populate(
      "orderItems.product"
    );
    if (!order) return next(new NotFoundError("Order not found"));

    if (order.status !== "pending") {
      return next(new BadRequestError("Only pending orders can be cancelled"));
    }

    // Restore product stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    if (order.paymentStatus === "paid") {
      order.paymentStatus = "refunded";
    }

    order.status = "cancelled";
    order.cancelledAt = new Date();

    await order.save();

    // Get fresh order data with populated fields for response
    const updatedOrder = await Order.findById(orderId).populate(
      "orderItems.product",
      "name price"
    );

    res.status(200).json({
      status: "success",
      message:
        "Order cancelled successfully and refund processed (if applicable)",
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export default cancelOrder;