import express from "express";
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

const userRoutes = express.Router();

// Public routes (no auth required)
userRoutes.post("/register", register);
userRoutes.get("/verify-email", verifyEmail);
userRoutes.post("/resend-verification", resendVerification);
userRoutes.post("/login", login);
userRoutes.post("/forgot-password", forgotPassword);
userRoutes.post("/reset-password", resetPassword);
userRoutes.post("/refresh-token", refreshAccessToken);

//Protected routes (require auth middleware)
userRoutes.use(auth);

// User actions
userRoutes.post("/change-password", changePassword);
userRoutes.get("/profile", getProfile);
userRoutes.patch("/editProfile", updateProfile);
userRoutes.post("/logout", logout);
userRoutes.delete("/delete-account", deleteUser);

// Admin-only actions
userRoutes.patch("/ban/:userId", authorize("admin"), banUser);
userRoutes.patch("/unban/:userId", authorize("admin"), unbanUser);
userRoutes.get("/all", authorize("admin"), getAllUsers);

export default userRoutes;