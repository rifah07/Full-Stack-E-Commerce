import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import User from "../../../models/user.model";
//import jwtManager from "../../../managers/jwtManager";
import emailManager from "../../../managers/emailManager";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, confirm_password, name, role } = req.body;

    // Validations
    if (!email) throw new Error("E-mail must be provided.");
    if (!password) throw new Error("Password must be provided.");
    if (password.length < 5)
      throw new Error("Password must be at least 5 characters long.");
    if (!name) throw new Error("Full name must be provided.");
    if (password !== confirm_password)
      throw new Error("Passwords do not match.");

    const existingUser = await User.findOne({ email });
    if (existingUser)
      throw new Error("This email already has an account. Try another one.");

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    //const accessToken = await jwtManager(createdUser);

    // Send registration email
    await emailManager(
      createdUser.email,
      "Welcome! You have successfully registered to E-Commerce. Thanks for choosing our platform.",
      `<h1>Welcome, ${createdUser.name}!</h1><p>Thanks for registering at E-Commerce Pro.</p>`,
      "Greetings from E-Commerce"
    );

    res.status(201).json({
      status: "Congratulations! You've registered successfully!",
      //accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export default register;