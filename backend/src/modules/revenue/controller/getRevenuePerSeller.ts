import { Response, NextFunction } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import Order from "../../../models/order.model";

// Revenue Per Seller
const getRevenuePerSeller = async (req: AuthRequest, res: Response) => {
  const revenuePerSeller = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $unwind: "$orderItems" },
    {
      $lookup: {
        from: "products",
        localField: "orderItems.product",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    { $unwind: "$productInfo" },
    {
      $group: {
        _id: "$orderItems.seller",
        totalRevenue: {
          $sum: { $multiply: ["$orderItems.quantity", "$productInfo.price"] },
        },
        orderCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "sellerInfo",
      },
    },
    { $unwind: "$sellerInfo" },
    {
      $project: {
        _id: 0,
        sellerId: "$_id",
        sellerName: "$sellerInfo.name",
        totalRevenue: 1,
        orderCount: 1,
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: { revenuePerSeller },
  });
};

export default getRevenuePerSeller;