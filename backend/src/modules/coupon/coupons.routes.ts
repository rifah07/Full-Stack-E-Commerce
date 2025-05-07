import express from "express";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import createCoupon from "./controller/createCoupon";
import getCoupons from "./controller/getCoupons";
import getCouponByCode from "./controller/getCouponByCode";
import updateCoupon from "./controller/updateCoupon";

const couponRoutes = express.Router();

// Admin routes
couponRoutes.use(auth);
couponRoutes.use(authorize("admin"));
couponRoutes.post("/", createCoupon);
couponRoutes.get("/", getCoupons);
couponRoutes.get("/:code", getCouponByCode);
couponRoutes.patch("/:code", updateCoupon);
/*
couponRoutes.delete("/:code", deleteCoupon);
*/

export default couponRoutes;