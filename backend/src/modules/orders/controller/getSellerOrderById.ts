import { Response, NextFunction } from "express";
import Order from "../../../models/order.model";
import { NotFoundError, UnauthorizedError } from "../../../utils/errors";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const getSellerOrderById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const sellerId = req.user?.id;
    const { orderId } = req.params;
  
    if (!sellerId || req.user?.role !== "seller") {
      return next(new UnauthorizedError("Only authenticated sellers can view their orders"));
    }
  
    try {
      const order = await Order.findOne({ _id: orderId, "orderItems.seller": sellerId })
        .populate("buyer", "name email")
        .populate("orderItems.product", "name price")
        .populate("orderItems.seller", "firstName lastName");
  
      if (!order) {
        return next(new NotFoundError("Order not found or does not belong to this seller"));
      }
  
      res.status(200).json({
        status: "success",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

  export default getSellerOrderById;