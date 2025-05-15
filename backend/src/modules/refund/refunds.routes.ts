import express from "express";
import requestRefund from "./controller/requestRefund";
import auth from "../../middlewares/authMiddleware";
import getRefundRequests from "./controller/getRefundRequests";
import authorize from "../../middlewares/authorize";
import getRefundRequestById from "./controller/getRefundRequestById";
import updateRefundStatus from "./controller/updateRefundStatus";
import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/errors";

const refundRoutes = express.Router();

//middleware to handle validation errors
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new BadRequestError(
        "Validation failed: " + JSON.stringify(errors.array())
      )
    );
  }
  next();
};

// protected routes
refundRoutes.use(auth);

//refundRoutes.use(authorize("admin", "seller"));
refundRoutes.get("/", authorize("admin", "seller"), getRefundRequests);

//refundRoutes.use(authorize("buyer"));

refundRoutes.get("/me", authorize("buyer"), getRefundRequests);
refundRoutes.post(
  "/request/:orderId",
  authorize("buyer"),
  [
    param("orderId")
      .notEmpty()
      .isMongoId()
      .withMessage("Order ID must be a valid MongoDB ID."),
    body("reason")
      .notEmpty()
      .trim()
      .withMessage("Reason for refund is required."),
  ],
  validate,
  requestRefund
);

refundRoutes.get(
  "/:refundId",
  authorize("admin", "seller"),
  [
    param("refundId")
      .notEmpty()
      .isMongoId()
      .withMessage("Refund ID must be a valid MongoDB ID."),
  ],
  validate,
  getRefundRequestById
);

refundRoutes.patch(
  "/:refundId",
  authorize("admin", "seller"),
  [
    param("refundId")
      .notEmpty()
      .isMongoId()
      .withMessage("Refund ID must be a valid MongoDB ID."),
    body("refundStatus")
      .notEmpty()
      .trim()
      .isIn(["pending", "approved", "rejected", "refunded"])
      .withMessage(
        "Refund status must be 'pending', 'approved', 'rejected' or 'refunded'."
      ),
  ],
  validate,
  updateRefundStatus
);

export default refundRoutes;