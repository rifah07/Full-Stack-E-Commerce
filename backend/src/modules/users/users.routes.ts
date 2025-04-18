import express from "express";
import User from "../../models/user.model";
import register from "./controller/register";
import verifyEmail from "./controller/verifyEmail";
import login from "./controller/login";

const userRoutes = express.Router();

// Public routes (no auth required)
userRoutes.post("/register", register);
userRoutes.get("/verify-email", verifyEmail);
userRoutes.post("/login", login)

export default userRoutes;