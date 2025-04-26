import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../../../models/user.model";
import { LoginZodSchema } from "../../../validators/user.validator";
import jwtManager from "../../../managers/jwtManager";
import RefreshToken from "../../../models/refreshToken.model";
import jwt from "jsonwebtoken";
import logger from "../../../utils/logger";
//import AppError from "../../../utils/AppError";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";
import catchAsync from "../../../utils/catchAsync";

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = await LoginZodSchema.safeParseAsync(req.body);

    if (!validatedData.success) {
      res.status(400).json({ errors: validatedData.error.issues });
      return;
    }

    const { email, password } = validatedData.data;

    const user = await User.findOne({ email });

    if (!user) throw new NotFoundError("User not found with this email.");

    if (!user.isVerified)
      throw new UnauthorizedError(
        "Please verify your email before logging in."
      );

    if (user.isBanned)
      throw new ForbiddenError(
        "Your account has been banned. Contact support."
      );

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) throw new UnauthorizedError("Incorrect password.");

    // Generate Access Token
    const accessToken = await jwtManager(user);

    // Generate Refresh Token (valid for 7 days)
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    // Store refresh token in database
    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      status: "Login successful!",
      // accessToken,
      // refreshToken,
    });
  }
);

export default login;
