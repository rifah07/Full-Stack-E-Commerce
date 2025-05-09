import { Response } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import Order from "../../../models/order.model";

// Platform-Wide Total Revenue
const getRevenue = async (req: AuthRequest, res: Response) => {
  const totalRevenue = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$finalPrice" } } }, // Use finalPrice
  ]);
  res.status(200).json({
    status: "success",
    data: { totalRevenue: totalRevenue[0]?.total || 0 },
  });
};
export default getRevenue;