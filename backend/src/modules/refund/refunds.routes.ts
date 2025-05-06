/*

import express from "express";
import { auth, adminMiddleware } from "../middlewares/authMiddleware";
import {
  requestRefund,
  getRefundRequests,
  updateRefundStatus,
  getRefundRequestById,
} from "../controllers/refund.controller";

const refundRoutes = express.refundRoutes();

// protected routes 
refundRoutes.use(auth);
refundRoutes.post("/request/:orderId", requestRefund);
refundRoutes.get("/me", getRefundRequests);

// Admin routes

refundRoutes.use(authorize("admin"));
refundRoutes.use(authMiddleware, adminMiddleware);
refundRoutes.get("/", getRefundRequests); // Get all refund requests
refundRoutes.get("/:refundId", getRefundRequestById);
refundRoutes.patch("/:refundId", updateRefundStatus);

export default refundRoutes;

*/