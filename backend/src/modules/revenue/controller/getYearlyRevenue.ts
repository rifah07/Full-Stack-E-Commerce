
import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import Order from "../../../models/order.model";
import moment from "moment";

// Platform-Wide Yearly Revenue
const getYearlyRevenue = async (req: AuthRequest, res: Response) => {
  const yearlyRevenue = await Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        createdAt: {
          $gte: moment().startOf("year").toDate(),
          $lte: moment().endOf("year").toDate(),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y",
            date: "$createdAt",
          },
        },
        yearlyTotal: { $sum: "$finalPrice" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    status: "success",
    data: { yearlyRevenue },
  });
};

export default getYearlyRevenue;