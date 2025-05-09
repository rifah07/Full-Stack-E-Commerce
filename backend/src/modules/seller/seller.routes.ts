import express from "express";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import getSellerRevenue from "./controller/getSellerRevenue";

const sellerRoutes = express.Router();

sellerRoutes.use(auth);
sellerRoutes.use(authorize("seller"));

sellerRoutes.get("/revenue", getSellerRevenue);

export default sellerRoutes;