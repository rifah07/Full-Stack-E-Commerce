import mongoose, { Document, Schema } from "mongoose";
import { IProduct } from "./product.model";
import { IUser } from "./user.model";

export interface IWishlistItem {
  product: IProduct["_id"];
  addedAt: Date;
}

export interface IWishlist extends Document {
  user: IUser["_id"];
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 1 wishlist per user
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        _id: false, // Prevent Mongoose from creating a default _id for subdocuments
      },
    ],
  },
  { timestamps: true }
);

const Wishlist = mongoose.model<IWishlist>("Wishlist", WishlistSchema);

export default Wishlist;