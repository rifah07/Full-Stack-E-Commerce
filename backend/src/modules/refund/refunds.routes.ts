import express from "express";
import requestRefund from "./controller/requestRefund";
import auth from "../../middlewares/authMiddleware";
import getRefundRequests from "./controller/getRefundRequests";
import authorize from "../../middlewares/authorize";
import getRefundRequestById from "./controller/getRefundRequestById";

const refundRoutes = express.Router();

// protected routes
refundRoutes.use(auth);

//refundRoutes.use(authorize("admin", "seller"));
refundRoutes.get("/",authorize("admin", "seller"), getRefundRequests);


//refundRoutes.use(authorize("buyer"));

refundRoutes.get("/me", authorize("buyer"), getRefundRequests);
refundRoutes.post("/request/:orderId", authorize("buyer"), requestRefund);

refundRoutes.get("/:refundId",authorize("admin", "seller"), getRefundRequestById);

/*


// Admin routes

refundRoutes.use(authorize("admin"));
refundRoutes.patch("/:refundId", updateRefundStatus);

*/
export default refundRoutes;
