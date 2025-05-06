import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import Refund from "../../../models/refund.model";

const getRefundRequests = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === "admin";

    let query = {};
    if (!isAdmin) {
      query = { user: userId };
    }

    const refunds = await Refund.find(query)
      .populate("order", "_id orderItems totalPrice")
      .populate("user", "_id name email");

    res.status(200).json({
      status: "success",
      data: { refunds },
    });
  } catch (error) {
    next(error);
  }
};
export default getRefundRequests;