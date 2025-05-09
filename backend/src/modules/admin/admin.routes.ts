import express from "express";
import auth from "../../middlewares/authMiddleware";
import getRevenue from "./controller/getRevenue";
import authorize from "../../middlewares/authorize";

const adminRoutes = express.Router();

//routes for admin only
adminRoutes.use(auth);
adminRoutes.use(authorize("admin"));

adminRoutes.get('/revenue', getRevenue);


export default adminRoutes;