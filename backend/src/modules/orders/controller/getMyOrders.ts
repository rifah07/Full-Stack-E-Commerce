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

    const totalOrders = myOrders.length;
    let totalAmount = 0;
    let paidAmount = 0;
    let refundedAmount = 0;
    let pendingAmount = 0;
    let activeOrders = 0;

    myOrders.forEach((order) => {
      let orderTotal = 0;
      order.orderItems.forEach((item) => {
        orderTotal += item.product.price * item.quantity;
      });

      if (order.status !== "cancelled") {
        totalAmount += orderTotal;
        activeOrders++;
      }

      if (order.status === "delivered") {
        paidAmount += orderTotal;
      } else if (order.status === "cancelled") {
        refundedAmount += orderTotal;
      } else if (order.status === "pending") {
        pendingAmount += orderTotal;
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
        pendingAmount,
      },
      data: myOrders,
    });
  } catch (error) {
    next(error);
  }
};

export default getMyOrders;