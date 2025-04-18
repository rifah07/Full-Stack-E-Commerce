import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import User from "../../../models/user.model";
import emailManager from "../../../managers/emailManager";

const resendVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new Error("Email must be provided.");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("No user found with this email.");
    }

    if (user.isVerified) {
      res.status(400).json({ message: "Email is already verified." });
      return;
    }

    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 60 * 60 * 1000 * 24); // 24 hours

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;
    await user.save();

    // Send new verification email
    await emailManager(
      user.email,
      "Resend Verification - E-Commerce",
      `<h1>Verify Your Email Again</h1><p>Your new verification code is:</p><h3>${emailVerificationToken}</h3><p>This code will expire in 24 hours. Visit /verify-email and pass it as query parameter: ?token=...</p>`,
      "Resend Email Verification"
    );

    res.status(200).json({
      message: "A new verification code has been sent to your email.",
    });
  } catch (error) {
    next(error);
  }
};

export default resendVerification;