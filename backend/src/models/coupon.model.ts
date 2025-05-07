import mongoose, { Document, Schema } from "mongoose";

export enum CouponStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  EXPIRED = "expired",
}

export enum CouponType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}

export interface ICoupon extends Document {
  code: string;
  description?: string;
  type: CouponType;
  value: number; // Percentage or fixed amount
  minOrderValue?: number; // Minimum order value for the coupon to be valid
  usageLimit?: number; // Maximum number of times the coupon can be used
  usageCount: number; // Number of times the coupon has been used
  expiresAt?: Date;
  status: CouponStatus;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema: Schema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(CouponType),
      required: [true, "Coupon type is required"],
    },
    value: {
      type: Number,
      required: [true, "Coupon value is required"],
      min: [0, "Coupon value cannot be negative"],
    },
    minOrderValue: {
      type: Number,
      min: [0, "Minimum order value cannot be negative"],
    },
    usageLimit: {
      type: Number,
      min: [1, "Usage limit must be at least 1"],
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    expiresAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(CouponStatus),
      default: CouponStatus.ACTIVE,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model<ICoupon>("Coupon", CouponSchema);

export default Coupon;