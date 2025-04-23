import { Response } from "express";
import { AuthRequest } from "../../../middlewares/authMiddleware";

export const logoutUser = async (req: AuthRequest, res: Response) => {
  try {
    res.status(200).json({ message: "User logged out successfully." });
    return;
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Server error during logout." });
    return;
  }
};