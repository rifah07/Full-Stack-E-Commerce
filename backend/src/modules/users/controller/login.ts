import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User, { LoginZodSchema } from "../../../models/user.model";
import jwtManager from "../../../managers/jwtManager";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body using the LoginZodSchema
    const validatedData = await LoginZodSchema.safeParseAsync(req.body);

    if (!validatedData.success) {
      return res.status(400).json({ errors: validatedData.error.issues });
    }

    const { email, password } = validatedData.data;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email." });
    }

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email before logging in." });
    }

    if (user.isBanned) {
      return res
        .status(403)
        .json({ message: "Your account has been banned. Contact support." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password." });
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