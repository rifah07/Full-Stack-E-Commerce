import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import Order from "../../../models/order.model";
import moment from "moment";
import { BadRequestError } from "../../../utils/errors";

// Platform-Wide Revenue by Date Range
const getRevenueByDateRange = async (req: AuthRequest, res: Response) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    throw new BadRequestError("startDate and endDate are required");
  }
  const start = moment(startDate as string)
    .startOf("day")
    .toDate();
  const end = moment(endDate as string)
    .endOf("day")
    .toDate();
  if (
    !moment(startDate as string).isValid() ||
    !moment(endDate as string).isValid()
  ) {
    throw new BadRequestError("Invalid date format for startDate or endDate");
  }
  const revenueByRange = await Order.aggregate([
    {
      $match: {
        paymentStatus: "paid",
        createdAt: { $gte: start, $lte: end },
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
    data: { revenueByRange },
  });
};

export default getRevenueByDateRange;