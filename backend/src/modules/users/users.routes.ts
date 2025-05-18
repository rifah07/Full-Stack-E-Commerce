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
 *     description: Create a new user account with name, email, password, confirm password, and optional role. Sends a verification email upon successful registration.
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
 *                 example: "seller"
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
 *               $ref: '#/components/schemas/Error400'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
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
 *     summary: Verify user email address
 *     tags: [Users]
 *     description: Verifies a user's email address using a token sent to their email. The token must be passed as a query parameter.
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Email verification token sent via email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Your email has been successfully verified! You can now login."
 *       400:
 *         description: Verification token is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       404:
 *         description: User not found or token expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
userRoutes.get("/verify-email", verifyEmail);

/**
 * @swagger
 * /users/resend-verification:
 *   post:
 *     summary: Resend email verification code
 *     tags: [Users]
 *     description: Sends a new email verification token to the user if they haven't verified their account yet.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "userpassword123"
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A new verification code has been sent to your email."
 *       400:
 *         description: Validation errors or email already verified
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
 *                             example: "Email is already verified."
 *                           code:
 *                             type: string
 *                 - $ref: '#/components/schemas/Error400'
 *       404:
 *         description: User not found with this email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
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

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     description: Logs in a verified user and sets HTTP-only access and refresh tokens as cookies.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "StrongPassword123"
 *     responses:
 *       200:
 *         description: Successful login. Access and refresh tokens set in cookies.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Login successful!"
 *       400:
 *         description: Validation error (e.g., missing fields or invalid email)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       401:
 *         description: Email not verified or incorrect password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       403:
 *         description: User is banned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
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

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Send password reset code
 *     tags: [Users]
 *     description: Sends a password reset code to the user's email if the account exists.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset code sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset code sent to your email."
 *       400:
 *         description: Validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                       message:
 *                         type: string
 *                       code:
 *                         type: string
 *       404:
 *         description: User not found with this email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
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

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Users]
 *     description: Resets a user's password using a valid reset token
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token received via email
 *         example: "bae6eabdfd92c70e93bac5ebb82008aa7874915f867b1fbbad5d89d1387c2fe0"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "NewStrongPassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password has been reset successfully."
 *       400:
 *         description: Validation error, missing token, or invalid/expired token
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Error400'
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
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

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Users]
 *     description: Refreshes the user's access token using their refresh token (stored in cookies)
 *     security: [] # No authorization required for this endpoint
 *     responses:
 *       200:
 *         description: Access token refreshed successfully and set in cookies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access token refreshed"
 *       401:
 *         description: No refresh token provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       403:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error403'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       500:
 *         description: Failed to refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to refresh token"
 *                 error:
 *                   type: object
 */
userRoutes.post("/refresh-token", refreshAccessToken);

//Protected routes (require auth middleware)
userRoutes.use(auth);

// User actions

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Users]
 *     description: Allows authenticated users to change their password by providing current password and new password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: "CurrentPassword123"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: "NewStrongPassword456"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password updated successfully."
 *       400:
 *         description: Validation error, incorrect current password, or new password same as old password
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Error400'
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
 *       401:
 *         description: Unauthorized - User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
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

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     description: Retrieves the profile information of the authenticated user. Requires a valid access token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6646058b545183cf35b4639e"
 *                 name:
 *                   type: string
 *                   example: "Jane Doe"
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "jane@example.com"
 *                 role:
 *                   type: string
 *                   example: "buyer"
 *                 isVerified:
 *                   type: boolean
 *                   example: true
 *                 isBanned:
 *                   type: boolean
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-01T12:00:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-16T09:30:00.000Z"
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
userRoutes.get("/profile", getProfile);

/**
 * @swagger
 * /users/editProfile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     description: Authenticated users can update their profile fields such as name, image, address, gender, and date of birth.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               image:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/images/jane.jpg"
 *               address:
 *                 type: string
 *                 example: "123 Main St, Dhaka"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: "female"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1998-08-21"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Jane Doe
 *                     email:
 *                       type: string
 *                       example: jane@example.com
 *                     role:
 *                       type: string
 *                       example: buyer
 *                     isBanned:
 *                       type: boolean
 *                       example: false
 *                     image:
 *                       type: string
 *                       format: uri
 *                       example: https://example.com/images/jane.jpg
 *                     address:
 *                       type: string
 *                       example: 123 Main St, Dhaka
 *                     gender:
 *                       type: string
 *                       example: female
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                       example: 1998-08-21
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid gender
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
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

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout the user
 *     tags: [Users]
 *     description: Logs out the authenticated user by removing the refresh token from the database and clearing the authentication cookies.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful, cookies cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
userRoutes.post("/logout", logout);

/**
 * @swagger
 * /users/delete-account:
 *   delete:
 *     summary: Delete the currently logged-in user's account
 *     tags: [Users]
 *     description: Permanently deletes the authenticated user's account from the database.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your account has been permanently deleted. We’re sad to see you go 💔
 *                 farewellNote:
 *                   type: string
 *                   example: If you change your mind, you're always welcome to rejoin!
 *       401:
 *         description: Unauthorized - user token is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error401'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error404'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
userRoutes.delete("/delete-account", deleteUser);

// Admin-only actions

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Retrieves a list of all users. Admin access only.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 totalUsers:
 *                   type: integer
 *                   example: 10
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       403:
 *         description: Forbidden - user is not an admin
 *       500:
 *         description: Server error
 */
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
