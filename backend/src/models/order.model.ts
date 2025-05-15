import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  seller: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export enum RefundStatus {
  NONE = "none",
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  REFUNDED = "refunded",
}

export interface IOrder extends Document {
  buyer: mongoose.Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: string;
  totalPrice: number;
  paymentMethod: "cod" | "sslcommerz" | "stripe" | "paypal";
  paymentStatus: "unpaid" | "paid" | "refunded";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  refundStatus: RefundStatus;
  couponCode?: string;
  discountAmount?: number;
  finalPrice?: number;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
      },
    ],
    shippingAddress: {
      type: String,
      required: [true, "Shipping address is required"],
      trim: true,
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "sslcommerz", "stripe", "paypal"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    refundStatus: {
      type: String,
      enum: Object.values(RefundStatus),
      default: RefundStatus.PENDING,
    },
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalPrice: {
      type: Number,
      min: 0,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;