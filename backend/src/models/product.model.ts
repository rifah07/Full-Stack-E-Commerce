import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  isDeleted: Boolean;
  discount?: {
    type: "percentage" | "fixed";
    value: number;
  };
  seller: mongoose.Types.ObjectId;
  averageRating?: number;
  numberOfReviews?: number;
  questionsAndAnswers: {
    _id?: mongoose.Types.ObjectId;
    question: string;
    answer?: string;
    user: mongoose.Types.ObjectId; //  people asking the question (could be buyer or general user)
    seller: mongoose.Types.ObjectId; // seller answering the question
    createdAt: Date;
    updatedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
    },
    images: {
      type: [String],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: { type: String, enum: ["percentage", "fixed"] },
      value: { type: Number, min: 0 },
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    questionsAndAnswers: [
      new Schema(
        {
          question: { type: String, required: true },
          answer: { type: String },
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
        },
        { timestamps: true }
      ),
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;