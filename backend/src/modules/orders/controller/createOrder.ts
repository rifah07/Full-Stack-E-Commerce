import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Order from "../../../models/order.model";
import Product from "../../../models/product.model";
import catchAsync from "../../../utils/catchAsync";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import { BadRequestError } from "../../../utils/errors";

const createOrder = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { orderItems, shippingAddress } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      throw new BadRequestError("Order items are required.");
    }

    let totalPrice = 0;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const populatedItems = await Promise.all(
        orderItems.map(async (item: { product: string; quantity: number }) => {
          const product = await Product.findOne({
            _id: item.product,
            isDeleted: false,
          }).session(session);
          if (!product) throw new Error("One or more products not found.");
          if (product.stock < item.quantity)
            throw new Error(`Insufficient stock for ${product.name}`);

          product.stock -= item.quantity;
          await product.save({ session });

          totalPrice += item.quantity * product.price;

          return { product: product._id, quantity: item.quantity };
        })
      );

      const newOrder = await Order.create(
        [
          {
            buyer: req.user?.id,
            orderItems: populatedItems,
            shippingAddress,
            totalPrice,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({ status: "success", data: newOrder[0] });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      next(err);
    }
  }
);

export default createOrder;