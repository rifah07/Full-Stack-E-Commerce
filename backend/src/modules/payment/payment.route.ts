import express from "express";
import paypalPayment from "./controller/paypalPayment";
import stripePayment from "./controller/stripePayment";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/errors";

const paymentRoutes = express.Router();

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

paymentRoutes.use(auth);
paymentRoutes.use(authorize("buyer"));

paymentRoutes.post(
  "/stripe",
  [
    body("amount")
      .isNumeric()
      .notEmpty()
      .withMessage("Amount is required and must be a number.")
      .toFloat(),
    body("currency")
      .notEmpty()
      .trim()
      .isLength({ min: 3, max: 3 })
      .withMessage("Currency is required and must be a 3-letter code."),
    body("paymentMethodId")
      .notEmpty()
      .trim()
      .withMessage("Payment method ID is required."),
  ],
  validate,
  stripePayment
);

paymentRoutes.post(
  "/paypal",
  [
    body("amount")
      .isNumeric()
      .notEmpty()
      .withMessage("Amount is required and must be a number.")
      .toFloat(),
    body("currency")
      .notEmpty()
      .trim()
      .isLength({ min: 3, max: 3 })
      .withMessage("Currency is required and must be a 3-letter code."),
  ],
  validate,
  paypalPayment
);

export default paymentRoutes;