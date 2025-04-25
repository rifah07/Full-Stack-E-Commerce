import { Request, Response, NextFunction } from "express";
import User from "../../../models/user.model";
import AppError from "../../../utils/AppError";

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;

    if (!token) {
      throw new Error("Verification token is required.");
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) throw new AppError("User not found with this email.", 404);

    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    user.isVerified = true;
    await user.save();

    res
      .status(200)
      .json({
        message:
          "Your email has been successfully verified! You can now login.",
      });
  } catch (error) {
    next(error);
  }
};

export default verifyEmail;