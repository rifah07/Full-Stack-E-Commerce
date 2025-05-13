import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import { morganStream } from "./utils/logger";
import errorHandler from "./handler/errorHandler";
import userRoutes from "./modules/users/users.routes";
import productRoutes from "./modules/products/products.routes";
import orderRoutes from "./modules/orders/orders.routes";
import cartRoutes from "./modules/cart/cart.routes";
import paymentRoutes from "./modules/payment/payment.route";
import wishlistRoutes from "./modules/wishlist/wishlist.routes";
import refundRoutes from "./modules/refund/refunds.routes";
import couponRoutes from "./modules/coupon/coupons.routes";
import adminRoutes from "./modules/admin/admin.routes";
import sellerRoutes from "./modules/seller/seller.routes";
import reviewRoute from "./modules/review/review.routes";
import reviewRoutes from "./modules/review/review.routes";

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Morgan HTTP logging into Winston
app.use(morgan("combined", { stream: morganStream }));

//models initialization
//require("./models/users.model");

//add routes here
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/review", reviewRoutes);


//end of routes

/*
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: "Not Found!",
  });
});
*/

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Server started successfully!");
});

app.listen(5000, () => {
  console.log("Server started successfully");
});

export default app;