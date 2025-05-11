// backend/src/models/review.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReview extends Document {
  product: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true, // for efficient querying of reviews for a product
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// a user can only review a product once
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;