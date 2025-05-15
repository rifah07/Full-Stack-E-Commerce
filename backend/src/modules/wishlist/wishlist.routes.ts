import express from "express";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import addToWishlist from "./controller/addToWishlist";
import getUserWishlist from "./controller/getUserWishlist";
import removeFromWishlist from "./controller/removeFromWishlist";
import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/errors";

const wishlistRoutes = express.Router();

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

//protected Routes
wishlistRoutes.use(auth);
wishlistRoutes.use(authorize("buyer"));

wishlistRoutes.post(
  "/add",
  [
    body("productId")
      .notEmpty()
      .isMongoId()
      .withMessage("Product ID must be a valid MongoDB ID."),
  ],
  validate,
  addToWishlist
);

wishlistRoutes.get("/", getUserWishlist);

wishlistRoutes.delete(
  "/remove/:productId",
  [
    param("productId")
      .notEmpty()
      .isMongoId()
      .withMessage("Product ID must be a valid MongoDB ID."),
  ],
  validate,
  removeFromWishlist
);

export default wishlistRoutes;