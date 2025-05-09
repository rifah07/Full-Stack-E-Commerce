import { Response } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import Order from "../../../models/order.model";
import { Types } from "mongoose";

const getSellerRevenue = async (req: AuthRequest, res: Response) => {
  const sellerId = req.user?.id;
  const sellerObjectId = new Types.ObjectId(sellerId);

  const sellerRevenue = await Order.aggregate([
    { $match: { paymentStatus: "paid", "orderItems.seller": sellerObjectId } },
    { $unwind: "$orderItems" },
    { $match: { "orderItems.seller": sellerObjectId } },
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
        _id: null,
        totalRevenue: {
          $sum: { $multiply: ["$orderItems.quantity", "$productInfo.price"] },
        },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: { sellerRevenue: sellerRevenue[0]?.totalRevenue || 0 },
  });
};

export default getSellerRevenue;