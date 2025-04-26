// modules/users/controller/refreshAccessToken.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import RefreshToken from "../../../models/refreshToken.model";
import jwtManager from "../../../managers/jwtManager";
import User from "../../../models/user.model";
//import AppError from "../../../utils/AppError";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";

const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) throw new UnauthorizedError("No refresh token provided");

    // Verify refresh token and find in DB
    const foundToken = await RefreshToken.findOne({ token: refreshToken });

    if (!foundToken) throw new ForbiddenError("Invalid refresh token");

    // Check expiration manually
    if (foundToken.expiresAt < new Date()) {
      await foundToken.deleteOne(); // Cleanup expired
      res.status(403).json({ message: "Refresh token expired" });
      return;
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { userId: string };

    const user = await User.findById(decoded.userId);
    if (!user) throw new NotFoundError("User not found with this email.");

    // Generate a new access token
    const newAccessToken = await jwtManager(user);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Access token refreshed" });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to refresh token", error });
    return;
  }
};

export default refreshAccessToken;