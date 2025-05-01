import { Request, Response, NextFunction } from "express";
import mongoose, { Types } from "mongoose";
import Order from "../../../models/order.model";
import Product, { IProduct } from "../../../models/product.model";
import catchAsync from "../../../utils/catchAsync";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../../utils/errors";

const createOrder = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { orderItems, shippingAddress } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      throw new BadRequestError("Order items are required.");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let totalPrice = 0;
      const populatedItems: { product: Types.ObjectId; quantity: number }[] =
        [];

      for (const item of orderItems) {
        const product = await Product.findOne<IProduct>({
          _id: item.product,
          isDeleted: false,
        }).session(session);

        if (!product) {
          throw new NotFoundError("One or more products not found.");
        }

        if (product.stock < item.quantity) {
          throw new ConflictError(`Insufficient stock for ${product.name}`);
        }

        product.stock -= item.quantity;
        await product.save({ session });

        totalPrice += item.quantity * product.price;

        populatedItems.push({
          product: product._id as Types.ObjectId,
          quantity: item.quantity,
        });
      }

      const [newOrder] = await Order.create(
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

      res.status(201).json({
        status: "success",
        data: newOrder,
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      next(err);
    }
  }
);

export default createOrder;
