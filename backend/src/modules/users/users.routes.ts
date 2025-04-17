import express from "express";
import User from "../../models/user.model";
import register from "./controller/register";
import verifyEmail from "./controller/verifyEmail";

const userRoutes = express.Router();

// Public routes (no auth required)
userRoutes.post("/register", register);
userRoutes.get("/verify-email", verifyEmail);

export default userRoutes;