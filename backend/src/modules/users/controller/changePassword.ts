import { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User, { ChangePasswordZodSchema } from "../../../models/user.model";
import { AuthRequest } from "../../../middlewares/authMiddleware";

const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    const validatedData = await ChangePasswordZodSchema.safeParseAsync(
      req.body
    );

    if (!validatedData.success) {
      return res.status(400).json({ errors: validatedData.error.issues });
    }

    const { currentPassword, newPassword } = validatedData.data;

    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "New password cannot be same as the old password." });
    }

    const user = await User.findById(userId).select("+password");
    //console.log("User ID from token:", userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
};

export default changePassword;