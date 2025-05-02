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

    const totalOrders = await Order.countDocuments({ buyer: userId });

    let totalAmount = 0;
    myOrders.forEach((order) => {
      let orderTotal = 0;
      order.orderItems.forEach((item) => {
        orderTotal += item.product.price * item.quantity;
      });
      totalAmount += orderTotal;
    });

    res.status(200).json({
      status: "success",
      totalOrders,
      totalAmount,
      data: myOrders,
    });
  } catch (error) {
    next(error);
  }
};

export default getMyOrders;
