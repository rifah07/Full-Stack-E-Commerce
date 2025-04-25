import { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../../../models/user.model";
import { ChangePasswordZodSchema } from "../../../validators/user.validator";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import AppError from "../../../utils/AppError";

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
      res.status(400).json({ errors: validatedData.error.issues });
      return;
    }

    const { currentPassword, newPassword } = validatedData.data;

    if (currentPassword === newPassword) {
      throw new AppError(
        "New password cannot be same as the old password.",
        400
      );
    }

    const user = await User.findById(userId).select("+password");
    //console.log("User ID from token:", userId);

    if (!user) throw new AppError("User not found with this email.", 404);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError("urrent password is incorrect.", 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
};

export default changePassword;