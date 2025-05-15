import express from "express";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import createReview from "./controller/createReview";
import getProductReviews from "./controller/getProductReviews";
import updateReview from "./controller/updateReview";
import deleteReview from "./controller/deleteReview";
import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/errors";

const reviewRoutes = express.Router();

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

reviewRoutes.get(
  "/:productId/reviews",
  [
    param("productId")
      .notEmpty()
      .isMongoId()
      .withMessage("Product ID must be a valid MongoDB ID."),
  ],
  validate,
  getProductReviews
);

reviewRoutes.use(auth);
reviewRoutes.use(authorize("buyer"));

reviewRoutes.post(
  "/:productId/reviews",
  [
    param("productId")
      .notEmpty()
      .isMongoId()
      .withMessage("Product ID must be a valid MongoDB ID."),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be an integer between 1 and 5."),
    body("comment").notEmpty().trim().withMessage("Comment cannot be empty."),
  ],
  validate,
  createReview
);

reviewRoutes.patch(
  "/:productId/reviews/:reviewId",
  [
    param("productId")
      .notEmpty()
      .isMongoId()
      .withMessage("Product ID must be a valid MongoDB ID."),
    param("reviewId")
      .notEmpty()
      .isMongoId()
      .withMessage("Review ID must be a valid MongoDB ID."),
    body("rating")
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be an integer between 1 and 5."),
    body("comment")
      .optional()
      .notEmpty()
      .trim()
      .withMessage("Comment cannot be empty."),
  ],
  validate,
  updateReview
);

reviewRoutes.delete(
  "/:productId/reviews/:reviewId",
  [
    param("productId")
      .notEmpty()
      .isMongoId()
      .withMessage("Product ID must be a valid MongoDB ID."),
    param("reviewId")
      .notEmpty()
      .isMongoId()
      .withMessage("Review ID must be a valid MongoDB ID."),
  ],
  validate,
  deleteReview
);

export default reviewRoutes;