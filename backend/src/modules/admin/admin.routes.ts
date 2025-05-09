import express from "express";
import auth from "../../middlewares/authMiddleware";
import getRevenue from "./controller/getRevenue";
import authorize from "../../middlewares/authorize";
import getWeeklyRevenue from "./controller/getWeeklyRevenue";

const adminRoutes = express.Router();

//routes for admin only
adminRoutes.use(auth);
adminRoutes.use(authorize("admin"));

adminRoutes.get('/revenue', getRevenue);
adminRoutes.get('/revenue/weekly', getWeeklyRevenue);


export default adminRoutes;