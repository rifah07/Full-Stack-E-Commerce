import { Request, Response } from "express";
import mongoose from "mongoose";

export const logout = async (req: Request, res: Response) => {
  try {
    const RefreshToken = mongoose.model("refresh_tokens");
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    // Clear tokens from cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      status: "Success",
      message: "Logged out successfully 💔",
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      status: "Failed",
      message: error?.message || "Something went wrong during logout",
    });
    return;
  }
};