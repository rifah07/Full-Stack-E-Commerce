import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import Order from "../../../models/order.model";
import moment from "moment";

// Platform-Wide Daily Revenue
const getDailyRevenue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const dailyRevenue = await Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        createdAt: {
          $gte: moment().startOf("day").toDate(),
          $lte: moment().endOf("day").toDate(),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        dailyTotal: { $sum: "$finalPrice" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    status: "success",
    data: { dailyRevenue },
  });
};

export default getDailyRevenue;