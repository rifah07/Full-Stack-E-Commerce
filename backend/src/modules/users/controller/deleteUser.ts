import { Request, Response } from "express";
import User from "../../../models/user.model";
import { AuthRequest } from "../../../middlewares/authMiddleware";

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized - Invalid token." });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message:
        "Your account has been permanently deleted. We’re sad to see you go 💔",
      farewellNote: "If you change your mind, you're always welcome to rejoin!",
    });
    return;
  } catch (error) {
    console.error("Error deleting account:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
    return;
  }
};