import { Request, Response } from "express";
import RefreshToken from "../../../models/refreshToken.model";

const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

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
      message: "💔 Logged out successfully.",
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      status: "Failed",
      message: error.message || "Logout failed",
    });
    return;
  }
};

export default logout;