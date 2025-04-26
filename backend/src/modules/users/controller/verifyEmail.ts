import { Request, Response, NextFunction } from "express";
import User from "../../../models/user.model";
//import AppError from "../../../utils/AppError";
import { BadRequestError, NotFoundError } from "../../../utils/errors";
import catchAsync from "../../../utils/catchAsync";

const verifyEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.query;

    if (!token) throw new BadRequestError("Verification token is required.");

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) throw new NotFoundError("User not found with this email.");

    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    user.isVerified = true;
    await user.save();

    res.status(200).json({
      message: "Your email has been successfully verified! You can now login.",
    });
  }
);

export default verifyEmail;
