import express from "express";
import auth from "../../middlewares/authMiddleware";
import getRevenue from "./controller/getRevenue";
import authorize from "../../middlewares/authorize";
import getWeeklyRevenue from "./controller/getWeeklyRevenue";
import getDailyRevenue from "./controller/getDailyRevenue";

import getMonthlyRevenue from "./controller/getMonthlyRevenue";
import getYearlyRevenue from "./controller/getYearlyRevenue";
import getRevenueByDateRange from "./controller/getRevenueByDateRange";


const adminRoutes = express.Router();

//routes for admin only
adminRoutes.use(auth);
adminRoutes.use(authorize("admin"));

adminRoutes.get('/revenue', getRevenue);
adminRoutes.get('/revenue/daily', getDailyRevenue);
adminRoutes.get('/revenue/weekly', getWeeklyRevenue);
adminRoutes.get('/revenue/monthly', getMonthlyRevenue);
adminRoutes.get('/revenue/yearly', getYearlyRevenue);
adminRoutes.get('/revenue/range', getRevenueByDateRange);



export default adminRoutes;