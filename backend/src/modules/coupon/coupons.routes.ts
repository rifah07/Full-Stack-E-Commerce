import express from "express";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import createCoupon from "./controller/createCoupon";
import getCoupons from "./controller/getCoupons";
import getCouponByCode from "./controller/getCouponByCode";
import updateCoupon from "./controller/updateCoupon";
import deleteCoupon from "./controller/deleteCoupon";
import createCouponForSeller from "./controller/createCouponForSeller";
import deleteSellerCoupon from "./controller/deleteSellerCoupon";
import updateSellerCoupon from "./controller/updateSellerCoupon";
import getSellerCouponById from "./controller/getSellerCouponById";
import getSellerCoupons from "./controller/getSellerCoupons";
import { body, param, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../../utils/errors";

const couponRoutes = express.Router();

// Middleware to handle validation errors
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

couponRoutes.use(auth);
couponRoutes.get("/", authorize("admin", "seller"), getCoupons);

//Seller routes
couponRoutes.post(
  "/seller/create",
  authorize("seller"),
  [
    body("code").notEmpty().trim().withMessage("Coupon code is required."),
    body("type")
      .isIn(["fixed", "percentage"])
      .withMessage("Discount type must be either 'fixed' or 'percentage'."),
    body("value")
      .isNumeric()
      .notEmpty()
      .withMessage("Discount value is required and must be a number.")
      .toFloat(),
    body("expiresAt")
      .isISO8601()
      .toDate()
      .withMessage("Expiration date must be a valid ISO 8601 date."),
    body("minOrderValue")
      .optional()
      .isNumeric()
      .toInt()
      .withMessage("Minimum order value must be a number."),
    body("usageCount")
      .optional()
      .isInt({ min: 0 })
      .toInt()
      .withMessage("Usage count must be a non-negative integer."),
    body("productSpecific").optional().isBoolean().toBoolean(),
    body("products")
      .optional()
      .isArray()
      .withMessage("Products must be an array."),
    body("products.*")
      .optional()
      .isMongoId()
      .withMessage("Each product ID in the array must be a valid MongoDB ID."),
    body("categorySpecific").optional().isBoolean().toBoolean(),
    body("categories")
      .optional()
      .isArray()
      .withMessage("Categories must be an array."),
    body("categories.*")
      .optional()
      .isMongoId()
      .withMessage("Each category ID in the array must be a valid MongoDB ID."),
    body("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Status must be either 'active' or 'inactive'."),
  ],
  validate,
  createCouponForSeller
);

/*
this is not needed as in single file getCoupons.ts the logic is written for admin and seller
couponRoutes.get("/seller", authorize("seller"), getSellerCoupons);
*/

// Admin routes
couponRoutes.post(
  "/",
  authorize("admin"),
  [
    body("code").notEmpty().trim().withMessage("Coupon code is required."),
    body("type")
      .isIn(["percentage", "fixed"])
      .withMessage("Discount type must be either 'percentage' or 'fixed'."),
    body("value")
      .isNumeric()
      .notEmpty()
      .withMessage("Discount value is required and must be a number.")
      .toFloat(),
    body("usageCount")
      .optional()
      .isInt({ min: 0 })
      .toInt()
      .withMessage("Usage count must be a non-negative integer."),
    body("seller")
      .optional()
      .isMongoId()
      .withMessage("Invalid seller ID format."),
    body("name").notEmpty().trim().withMessage("Coupon name is required."),
    body("minOrderValue")
      .optional()
      .isNumeric()
      .toInt()
      .withMessage("Minimum order value must be a number."),
    body("productSpecific").optional().isBoolean().toBoolean(),
    body("products")
      .optional()
      .isArray()
      .withMessage("Products must be an array."),
    body("products.*")
      .optional()
      .isMongoId()
      .withMessage("Each product ID in the array must be a valid MongoDB ID."),
    body("categorySpecific").optional().isBoolean().toBoolean(),
    body("categories")
      .optional()
      .isArray()
      .withMessage("Categories must be an array."),
    body("categories.*")
      .optional()
      .isMongoId()
      .withMessage("Each category ID in the array must be a valid MongoDB ID."),
    body("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Status must be either 'active' or 'inactive'."),
    body("expiresAt")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Expiration date must be a valid ISO 8601 date."),
  ],
  validate,
  createCoupon
);

couponRoutes.get(
  "/:code",
  authorize("admin", "seller"),
  [param("code").notEmpty().trim().withMessage("Coupon code is required.")],
  validate,
  getCouponByCode
);

couponRoutes.patch(
  "/:code",
  authorize("admin"),
  [
    param("code").notEmpty().trim().withMessage("Coupon code is required."),
    body("type")
      .optional()
      .isIn(["percentage", "fixed"])
      .withMessage("Discount type must be either 'percentage' or 'fixed'."),
    body("value")
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage("Discount value must be a number.")
      .toFloat(),
    body("usageCount")
      .optional()
      .isInt({ min: 0 })
      .toInt()
      .withMessage("Usage count must be a non-negative integer."),
    body("isActive")
      .optional()
      .isBoolean()
      .toBoolean()
      .withMessage("isActive must be a boolean value."),
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Coupon name cannot be empty."),
    body("minOrderValue")
      .optional()
      .isNumeric()
      .toInt()
      .withMessage("Minimum order value must be a number."),
    body("productSpecific").optional().isBoolean().toBoolean(),
    body("products")
      .optional()
      .isArray()
      .withMessage("Products must be an array."),
    body("products.*")
      .optional()
      .isMongoId()
      .withMessage("Each product ID in the array must be a valid MongoDB ID."),
    body("categorySpecific").optional().isBoolean().toBoolean(),
    body("categories")
      .optional()
      .isArray()
      .withMessage("Categories must be an array."),
    body("categories.*")
      .optional()
      .isMongoId()
      .withMessage("Each category ID in the array must be a valid MongoDB ID."),
    body("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Status must be either 'active' or 'inactive'."),
    body("expiresAt")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Expiration date must be a valid ISO 8601 date."),
  ],
  validate,
  updateCoupon
);

couponRoutes.delete(
  "/:code",
  authorize("admin"),
  [param("code").notEmpty().trim().withMessage("Coupon code is required.")],
  validate,
  deleteCoupon
);

//seller routes with id in query parameter

/*
this is not needed now as in getCouponByCode the logic is written for both seller and admin, but it can
bse used to see coupon by Id by seller
couponRoutes.get("/seller/:couponId", authorize("seller"), getSellerCouponById);
*/
couponRoutes.patch(
  "/seller/:couponId",
  authorize("seller"),
  [
    param("couponId")
      .notEmpty()
      .isMongoId()
      .withMessage("Coupon ID must be a valid MongoDB ID."),
    body("type")
      .optional()
      .isIn(["percentage", "fixed"])
      .withMessage("Discount type must be either 'percentage' or 'fixed'."),
    body("value")
      .optional()
      .isNumeric()
      .notEmpty()
      .withMessage("Discount value must be a number.")
      .toFloat(),
    body("usageCount")
      .optional()
      .isInt({ min: 0 })
      .toInt()
      .withMessage("Usage count must be a non-negative integer."),
    body("isActive")
      .optional()
      .isBoolean()
      .toBoolean()
      .withMessage("isActive must be a boolean value."),
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Coupon name cannot be empty."),
    body("minOrderValue")
      .optional()
      .isNumeric()
      .toInt()
      .withMessage("Minimum order value must be a number."),
    body("productSpecific").optional().isBoolean().toBoolean(),
    body("products")
      .optional()
      .isArray()
      .withMessage("Products must be an array."),
    body("products.*")
      .optional()
      .isMongoId()
      .withMessage("Each product ID in the array must be a valid MongoDB ID."),
    body("categorySpecific").optional().isBoolean().toBoolean(),
    body("categories")
      .optional()
      .isArray()
      .withMessage("Categories must be an array."),
    body("categories.*")
      .optional()
      .isMongoId()
      .withMessage("Each category ID in the array must be a valid MongoDB ID."),
    body("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Status must be either 'active' or 'inactive'."),
    body("expiresAt")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Expiration date must be a valid ISO 8601 date."),
  ],
  validate,
  updateSellerCoupon
);
couponRoutes.delete(
  "/seller/:couponId",
  authorize("seller"),
  [
    param("couponId")
      .notEmpty()
      .isMongoId()
      .withMessage("Coupon ID must be a valid MongoDB ID."),
  ],
  validate,
  deleteSellerCoupon
);

export default couponRoutes;
