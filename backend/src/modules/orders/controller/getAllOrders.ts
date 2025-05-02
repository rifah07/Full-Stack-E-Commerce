import { Response, NextFunction } from "express";
import Order from "../../../models/order.model";
import { UnauthorizedError } from "../../../utils/errors";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const getAllOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.role !== "admin") {
      return next(new UnauthorizedError("Only admin can view all orders"));
    }
    const orders = await Order.find()
      .populate("buyer", "name email")
      .populate("orderItems.product", "name price");
    const totalOrders = await Order.countDocuments();
    res.status(200).json({
      status: "success",
      totalOrders,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
export default getAllOrders;
