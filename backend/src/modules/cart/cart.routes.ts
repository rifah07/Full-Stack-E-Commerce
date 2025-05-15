import { Router } from "express";
import { addToCart } from "./controller/addToCart";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import getMyCart from "./controller/getMyCart";
import removeFromCart from "./controller/removeFromCart";
import updateCartItemQuantity from "./controller/updateCartItemQuantity";
import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/errors";

const cartRoutes = Router();

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

cartRoutes.use(auth);
cartRoutes.use(authorize("buyer"));

cartRoutes.post(
  "/add",
  [
    body("productId")
      .notEmpty()
      .isMongoId()
      .withMessage("Product ID must be a valid MongoDB ID."),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer."),
  ],
  validate,
  addToCart
);

cartRoutes.get("/my-cart", getMyCart);

cartRoutes.delete(
  "/remove/:productId",
  [
    param("productId")
      .notEmpty()
      .isMongoId()
      .withMessage("Product ID must be a valid MongoDB ID."),
  ],
  validate,
  removeFromCart
);
cartRoutes.patch(
  "/update/:productId",
  [
    param("productId")
      .notEmpty()
      .isMongoId()
      .withMessage("Product ID must be a valid MongoDB ID."),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be a positive integer."),
  ],
  validate,
  updateCartItemQuantity
);

export default cartRoutes;