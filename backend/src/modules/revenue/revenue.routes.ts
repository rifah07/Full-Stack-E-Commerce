import express from "express";
import auth from "../../middlewares/authMiddleware";
import getRevenue from "./controller/getRevenue";
import authorize from "../../middlewares/authorize";
import getWeeklyRevenue from "./controller/getWeeklyRevenue";
import getDailyRevenue from "./controller/getDailyRevenue";

import getMonthlyRevenue from "./controller/getMonthlyRevenue";
import getYearlyRevenue from "./controller/getYearlyRevenue";
import getRevenueByDateRange from "./controller/getRevenueByDateRange";
import getRevenuePerSeller from "./controller/getRevenuePerSeller";
import getSellerRevenue from "./controller/getSellerRevenue";

const revenueRoutes = express.Router();

revenueRoutes.use(auth);

//routes for seller
revenueRoutes.get("/", authorize("seller"), getSellerRevenue);

//routes for admin only
revenueRoutes.get("/total", authorize("admin"), getRevenue);
revenueRoutes.get("/daily", authorize("admin"), getDailyRevenue);
revenueRoutes.get("/weekly", authorize("admin"), getWeeklyRevenue);
revenueRoutes.get("/monthly", authorize("admin"), getMonthlyRevenue);
revenueRoutes.get("/yearly", authorize("admin"), getYearlyRevenue);
revenueRoutes.get("/range", authorize("admin"), getRevenueByDateRange);
revenueRoutes.get("/sellers", authorize("admin"), getRevenuePerSeller);

export default revenueRoutes;