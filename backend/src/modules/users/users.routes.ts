import express, { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";
import register from "./controller/register";
import verifyEmail from "./controller/verifyEmail";
import login from "./controller/login";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import resendVerification from "./controller/resendVerification";
import forgotPassword from "./controller/forgotPassword";
import resetPassword from "./controller/resetPassword";
import changePassword from "./controller/changePassword";
import getProfile from "./controller/profile";
import updateProfile from "./controller/updateProfile";
import { deleteUser } from "./controller/deleteUser";
import refreshAccessToken from "./controller/refreshAccessToken";
import logout from "./controller/logout";
import banUser from "./controller/banUser";
import unbanUser from "./controller/unbanUser";
import getAllUsers from "./controller/getAllUsers";
import { body, param, validationResult } from "express-validator";
import { BadRequestError } from "../../utils/errors";

const userRoutes = express.Router();

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

// Public routes

userRoutes.post(
  "/register",
  [
    body("name").notEmpty().trim().withMessage("Name is required"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  validate,
  register
);
userRoutes.get("/verify-email", verifyEmail);
userRoutes.post(
  "/resend-verification",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  resendVerification
);
userRoutes.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);
userRoutes.post(
  "/forgot-password",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email format"),
  ],
  validate,
  forgotPassword
);
userRoutes.post(
  "/reset-password",
  [
    body("token").notEmpty().trim().withMessage("Token is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
  ],
  validate,
  resetPassword
);
userRoutes.post("/refresh-token", refreshAccessToken);

//Protected routes (require auth middleware)
userRoutes.use(auth);

// User actions

userRoutes.post(
  "/change-password",
  [
    body("currentPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
  ],
  validate,
  changePassword
);
userRoutes.get("/profile", getProfile);
userRoutes.patch(
  "/editProfile",
  [
    body("name")
      .optional()
      .notEmpty()
      .trim()
      .withMessage("Name cannot be empty"),
    body("image").optional().isURL().withMessage("Invalid image URL"),
    body("address")
      .optional()
      .notEmpty()
      .trim()
      .withMessage("Address cannot be empty"),
    body("gender")
      .optional()
      .isIn(["male", "female", "other"])
      .withMessage("Invalid gender"),
    body("dateOfBirth")
      .optional()
      .isISO8601()
      .toDate()
      .withMessage("Invalid date format"),
  ],
  validate,
  updateProfile
);
userRoutes.post("/logout", logout);
userRoutes.delete("/delete-account", deleteUser);

// Admin-only actions

userRoutes.get("/all", authorize("admin"), getAllUsers);
userRoutes.patch(
  "/ban/:userId",
  authorize("admin"),
  [param("userId").isMongoId().withMessage("Invalid user ID")],
  validate,
  banUser
);
userRoutes.patch(
  "/unban/:userId",
  authorize("admin"),
  [param("userId").isMongoId().withMessage("Invalid user ID")],
  validate,
  unbanUser
);

export default userRoutes;