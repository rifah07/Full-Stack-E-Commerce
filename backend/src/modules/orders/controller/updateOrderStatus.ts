import { Response, NextFunction } from "express";
import Order from "../../../models/order.model";
import { NotFoundError, UnauthorizedError } from "../../../utils/errors";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const updateOrderStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!["admin", "seller"].includes(req.user?.role)) {
      return next(
        new UnauthorizedError("Only admin or seller can update status")
      );
    }

    const order = await Order.findById(orderId);
    if (!order) return next(new NotFoundError("Order not found"));

    // authorization check for sellers
    if (userRole === "seller") {
      const isSellerOrder = order.orderItems.some(
        (item) => String(item.seller) === userId
      );
      if (!isSellerOrder) {
        return next(
          new UnauthorizedError(
            "Seller cannot update the status of orders that do not contain their products"
          )
        );
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      status: "success",
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export default updateOrderStatus;