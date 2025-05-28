import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import Order from "../../../models/order.model";
import moment from "moment";

// Platform-Wide MOnthly Revenue
const getMonthlyRevenue = async (req: AuthRequest, res: Response) => {
  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        createdAt: {
          $gte: moment().startOf("month").toDate(),
          $lte: moment().endOf("month").toDate(),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m",
            date: "$createdAt",
          },
        },
        monthlyTotal: {
          $sum: "$finalPrice",
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    status: "success",
    data: { monthlyRevenue },
  });
};

export default getMonthlyRevenue;
