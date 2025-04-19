import express from "express";
import User from "../../models/user.model";
import register from "./controller/register";
import verifyEmail from "./controller/verifyEmail";
import login from "./controller/login";
import auth from "../../middlewares/authMiddleware";
import resendVerification from "./controller/resendVerification";
import forgotPassword from "./controller/forgotPassword";
import resetPassword from "./controller/resetPassword";

const userRoutes = express.Router();

// Public routes (no auth required)
userRoutes.post("/register", register);
userRoutes.get("/verify-email", verifyEmail);
userRoutes.post("/resend-verification",resendVerification);
userRoutes.post("/login", login);
userRoutes.post("/forgot-password", forgotPassword);
userRoutes.post("/reset-password", resetPassword);



//Protected routes (require auth middleware)
//userRoutes.use(auth);


export default userRoutes;