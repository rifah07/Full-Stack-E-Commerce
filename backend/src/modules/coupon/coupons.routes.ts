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

const couponRoutes = express.Router();

//Seller routes
couponRoutes.post(
  "/seller/create",
  auth,
  authorize("seller"),
  createCouponForSeller
);

// Admin routes
couponRoutes.use(auth);

couponRoutes.post("/", authorize("admin"), createCoupon);
couponRoutes.get("/",authorize("admin"),  getCoupons);
couponRoutes.get("/:code", authorize("admin"), getCouponByCode);
couponRoutes.patch("/:code", authorize("admin"), updateCoupon);
couponRoutes.delete("/:code",authorize("admin"), deleteCoupon);

couponRoutes.patch('/seller/:couponId', authorize("seller"), updateSellerCoupon);
couponRoutes.delete('/seller/:couponId', authorize("seller"), deleteSellerCoupon);


export default couponRoutes;
