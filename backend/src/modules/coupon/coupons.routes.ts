import express from "express";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import createCoupon from "./controller/createCoupon";
import getCoupons from "./controller/getCoupons";
import getCouponByCode from "./controller/getCouponByCode";
import updateCoupon from "./controller/updateCoupon";
import deleteCoupon from "./controller/deleteCoupon";
import createCouponForSeller from "./controller/createCouponForSeller";
import deleteSellerCoupon from "./controller/deleteSellerCoupon";
import updateSellerCoupon from "./controller/updateSellerCoupon";
import getSellerCouponById from "./controller/getSellerCouponById";
import getSellerCoupons from "./controller/getSellerCoupons";

const couponRoutes = express.Router();

couponRoutes.use(auth);
couponRoutes.get("/", getCoupons);

//Seller routes
couponRoutes.post(
  "/seller/create",
  authorize("seller"),
  createCouponForSeller
);

/*
this is not needed as in single file getCoupons.ts the logic is written for admin and seller
couponRoutes.get("/seller", authorize("seller"), getSellerCoupons);
*/

// Admin routes

couponRoutes.post("/", authorize("admin"), createCoupon);
couponRoutes.get("/:code", authorize("admin"), getCouponByCode);
couponRoutes.patch("/:code", authorize("admin"), updateCoupon);
couponRoutes.delete("/:code", authorize("admin"), deleteCoupon);

//seller routes with id in query parameter

couponRoutes.get("/seller/:couponId", authorize("seller"), getSellerCouponById);
couponRoutes.patch(
  "/seller/:couponId",
  authorize("seller"),
  updateSellerCoupon
);
couponRoutes.delete(
  "/seller/:couponId",
  authorize("seller"),
  deleteSellerCoupon
);

export default couponRoutes;
