import { Response, NextFunction } from "express";
import Order from "../../../models/order.model";
import { UnauthorizedError } from "../../../utils/errors";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const getSellerOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const sellerId = req.user?.id;
  if (!sellerId || req.user?.role !== "seller") {
    return next(
      new UnauthorizedError("Only authenticated sellers can view their orders")
    );
  }

  try {
    const orders = await Order.find({ "orderItems.seller": sellerId })
      .populate("buyer", "name email")
      .populate("orderItems.product", "name price")
      .populate("orderItems.seller", "firstName lastName");
    const totalOrders = await Order.countDocuments({
      "orderItems.seller": sellerId,
    });

    res.status(200).json({
      status: "success",
      totalOrders,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export default getSellerOrders;
