import mongoose, { Document, Schema, Types } from "mongoose";

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
  value: number;
  minOrderValue?: number;
  usageLimit?: number;
  usageCount: number;
  expiresAt?: Date;
  status: CouponStatus;
  seller?: Types.ObjectId;
  productSpecific: boolean;
  products: Types.ObjectId[];
  categorySpecific: boolean;
  categories: string[];
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
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    productSpecific: {
      type: Boolean,
      default: false,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    categorySpecific: {
      type: Boolean,
      default: false,
    },
    categories: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

const Coupon = mongoose.model<ICoupon>("Coupon", CouponSchema);

export default Coupon;