import { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../../../models/user.model";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res
        .status(400)
        .json({ message: "Both current and new passwords are required." });
      return;
    }

    if (currentPassword === newPassword) {
      res
        .status(400)
        .json({ message: "New password cannot be same as the old password." });
      return;
    }

    const user = await User.findById(userId).select("+password");
    console.log("User ID from token:", userId);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Current password is incorrect." });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
};

export default changePassword;