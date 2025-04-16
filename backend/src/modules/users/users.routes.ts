import express from "express";
import User from "../../models/user.model";
import register from "./controller/register";

const userRoutes = express.Router();

// Public routes (no auth required)
userRoutes.post("/register", register);

export default userRoutes;