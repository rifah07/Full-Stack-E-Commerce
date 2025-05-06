import mongoose, { Document, Schema } from "mongoose";
import { IOrder } from "./order.model";
import { IUser } from "./user.model";

export enum RefundStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  REFUNDED = "refunded",
}

export interface IRefund extends Document {
  order: IOrder["_id"];
  user: IUser["_id"];
  reason: string;
  requestedAt: Date;
  status: RefundStatus;
  processedAt?: Date;
  processedBy?: IUser["_id"]; // Admin who processed the refund
  refundAmount: number;
}

const RefundSchema: Schema = new Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: Object.values(RefundStatus),
      default: RefundStatus.PENDING,
    },
    processedAt: {
      type: Date,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the admin user
    },
    refundAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const Refund = mongoose.model<IRefund>("Refund", RefundSchema);

export default Refund;