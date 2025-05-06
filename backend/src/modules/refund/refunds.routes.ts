import express from "express";
import requestRefund from "./controller/requestRefund";
import auth from "../../middlewares/authMiddleware";
import getRefundRequests from "./controller/getRefundRequests";
import authorize from "../../middlewares/authorize";

const refundRoutes = express.Router();

// protected routes
refundRoutes.use(auth);
refundRoutes.get("/me", getRefundRequests);
refundRoutes.post("/request/:orderId", requestRefund);
/*


// Admin routes

refundRoutes.use(authorize("admin"));
refundRoutes.use(authMiddleware, adminMiddleware);
refundRoutes.get("/", getRefundRequests); // Get all refund requests
refundRoutes.get("/:refundId", getRefundRequestById);
refundRoutes.patch("/:refundId", updateRefundStatus);

*/
export default refundRoutes;
