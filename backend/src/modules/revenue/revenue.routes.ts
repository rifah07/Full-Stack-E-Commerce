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
revenueRoutes.get("/total",authorize("admin"), getRevenue);
revenueRoutes.get("/daily", getDailyRevenue);
revenueRoutes.get("/weekly", getWeeklyRevenue);
revenueRoutes.get("/monthly", getMonthlyRevenue);
revenueRoutes.get("/yearly", getYearlyRevenue);
revenueRoutes.get("/range", getRevenueByDateRange);
revenueRoutes.get("/sellers", getRevenuePerSeller);

export default revenueRoutes;
