import { AuthRequest } from "../../../middlewares/authMiddleware";
import { Response, NextFunction } from "express";
import Order from "../../../models/order.model";

const getMyOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    const myOrders = await Order.find({ buyer: userId }).populate<{
      orderItems: {
        product: { price: number; name: string };
        quantity: number;
      }[];
    }>("orderItems.product", "name price");

    let totalOrders = myOrders.length;
    let totalAmount = 0;
    let paidAmount = 0;
    let refundedAmount = 0;
    let unpaidPendingAmount = 0;
    let activeOrders = 0;

    myOrders.forEach((order) => {
      let orderTotal = 0;
      order.orderItems.forEach((item) => {
        orderTotal += item.product.price * item.quantity;
      });

      totalAmount += orderTotal;

      if (order.status !== "cancelled") activeOrders++;

      if (order.paymentStatus === "paid" && order.status !== "cancelled") {
        paidAmount += orderTotal;
      } else if (order.paymentStatus === "refunded") {
        refundedAmount += orderTotal;
      } else if (
        order.paymentStatus === "unpaid" &&
        order.status === "pending"
      ) {
        unpaidPendingAmount += orderTotal;
      }
    });

    res.status(200).json({
      status: "success",
      summary: {
        totalOrders,
        activeOrders,
        totalAmount,
        paidAmount,
        refundedAmount,
        unpaidPendingAmount,
      },
      data: myOrders,
    });
  } catch (error) {
    next(error);
  }
};

export default getMyOrders;