import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import Order from "../../../models/order.model";
import moment from "moment";

// Platform-Wide Weekly Revenue
const getWeeklyRevenue = async (req: AuthRequest, res: Response) => {
  const weeklyRevenue = await Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        createdAt: {
          $gte: moment().startOf("week").toDate(),
          $lte: moment().endOf("week").toDate(),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-W%U",
            date: "$createdAt",
          },
        },
        weeklyTotal: {
          $sum: "$finalPrice",
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    status: "success",
    data: { weeklyRevenue },
  });
};

export default getWeeklyRevenue;
