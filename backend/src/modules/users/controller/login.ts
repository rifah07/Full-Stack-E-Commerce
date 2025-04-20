import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../../../models/user.model";
import { LoginZodSchema } from "../../../validators/user.validator";
import jwtManager from "../../../managers/jwtManager";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body using the LoginZodSchema
    const validatedData = await LoginZodSchema.safeParseAsync(req.body);

    if (!validatedData.success) {
      res.status(400).json({ errors: validatedData.error.issues });
      return;
    }

    const { email, password } = validatedData.data;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found with this email." });
      return;
    }

    if (!user.isVerified) {
      res
        .status(401)
        .json({ message: "Please verify your email before logging in." });
      return;
    }

    if (user.isBanned) {
      res
        .status(403)
        .json({ message: "Your account has been banned. Contact support." });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Incorrect password." });
      return;
    }

    const accessToken = await jwtManager(user);

    res.status(200).json({
      status: "Login successful!",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export default login;