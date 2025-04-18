import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../../../models/user.model";
import jwtManager from "../../../managers/jwtManager";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found with this email.");
    }

    if (!user.isVerified) {
      throw new Error("Please verify your email before logging in.");
    }

    if (user.isBanned) {
      throw new Error("Your account has been banned. Contact support.");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error("Incorrect password.");
    }

    const accessToken = await jwtManager(user);

    res.status(200).json({
      status: "Login successful!",
      accessToken,
    });

  } catch (error) {
    next(error);
  }
};

export default login;