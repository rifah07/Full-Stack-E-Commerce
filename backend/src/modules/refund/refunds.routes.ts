import express from "express";
import requestRefund from "./controller/requestRefund";
import auth from "../../middlewares/authMiddleware";
import getRefundRequests from "./controller/getRefundRequests";
import authorize from "../../middlewares/authorize";
import getRefundRequestById from "./controller/getRefundRequestById";
import updateRefundStatus from "./controller/updateRefundStatus";

const refundRoutes = express.Router();

// protected routes
refundRoutes.use(auth);

//refundRoutes.use(authorize("admin", "seller"));
refundRoutes.get("/", authorize("admin", "seller"), getRefundRequests);

//refundRoutes.use(authorize("buyer"));

refundRoutes.get("/me", authorize("buyer"), getRefundRequests);
refundRoutes.post("/request/:orderId", authorize("buyer"), requestRefund);

refundRoutes.get(
  "/:refundId",
  authorize("admin", "seller"),
  getRefundRequestById
);
refundRoutes.patch(
  "/:refundId",
  authorize("admin", "seller"),
  updateRefundStatus
);

export default refundRoutes;
