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
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     description: Create a new user account with name, email, password and confirm_password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirm_password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "a@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *               confirm_password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 enum: [admin, seller, buyer]
 *                 default: buyer
 *                 example: "Seller"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Registration successful! Please check your email to verify your account."
 *       400:
 *         description: Validation errors, password mismatch, or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           path:
 *                             type: array
 *                             items:
 *                               type: string
 *                           message:
 *                             type: string
 *                           code:
 *                             type: string
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /users/verify-email:
 *   get:
 *     summary: Verify user's email address
 *     tags: [Users]
 *     description: Verifies a user's email using a token sent to their email. The token must not be expired.
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Email verification token
 *         example: "9cbeeeac-9934-4f1a-a771-627b9c7e78e0"
 *     responses:
 *       200:
 *         description: Email successfully verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Your email has been successfully verified! You can now login."
 *       400:
 *         description: Token is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: No user found with the provided token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

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
userRoutes.get("/all", authorize("admin"), getAllUsers);

export default userRoutes;
