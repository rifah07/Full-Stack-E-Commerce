import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  buyer: mongoose.Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: string;
  totalPrice: number;
  paymentMethod: "cod" | "sslcommerz" | "stripe" | "paypal";
  paymentStatus: "unpaid" | "paid" | "refunded";
  status: "pending" | "shipped" | "delivered" | "cancelled";
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  paymentIntentId: String; // <-- store from Stripe payment
  isRefunded: Boolean;
  refundReason: String;
  refundedAt: Date;
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
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    paymentIntentId: String,
    isRefunded: { type: Boolean, default: false },
    refundReason: { type: String },
    refundedAt: { type: Date },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;