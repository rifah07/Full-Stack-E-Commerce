import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../../../models/user.model";
import emailManager from "../../../managers/emailManager";
import { z } from "zod";

// specific Zod schema for registration
const RegisterZodSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters long." })
      .max(100, { message: "Full name cannot exceed 100 characters." }),
    email: z
      .string()
      .email({ message: "Please enter a valid e-mail address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),
    confirm_password: z.string(),
    role: z
      .string()
      .optional()
      .default("buyer")
      .transform((val) => val.toLowerCase())
      .pipe(z.enum(["admin", "seller", "buyer"] as const))
      .describe(
        "User role during registration (optional, defaults to buyer, will be stored in lowercase)"
      ),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validations

    const validatedData = await RegisterZodSchema.safeParseAsync(req.body);

    if (!validatedData.success) {
      res.status(400).json({ errors: validatedData.error.issues });
      return;
    }

    const { email, password, name, role, confirm_password } =
      validatedData.data;

    if (password !== confirm_password)
      throw new Error("Passwords do not match.");

    const existingUser = await User.findOne({ email });
    if (existingUser)
      throw new Error("This email already has an account. Try another one.");

    const hashedPassword = await bcrypt.hash(password, 12);

    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 60 * 60 * 1000 * 24); // 24 hour

    const createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      emailVerificationToken,
      emailVerificationExpires,
    });

    // Send verification email

    await emailManager(
      createdUser.email,
      `Welcome ${createdUser.name}! You have successfully registered to E-Commerce.\n\nYour verification code is: ${emailVerificationToken}\n\nThis code will expire in 1 hour.`,
      `<h1>Welcome, ${createdUser.name}!</h1><p>Thanks for registering at E-Commerce.</p>
       <p><strong>Your Email Verification Code:</strong></p>
       <h2>${emailVerificationToken}</h2>
       <p>This code will expire in 24 hour. Please visit the <code>/verify-email</code> endpoint and pass the code as a query parameter.</p>`,
      "Verify Your E-Commerce Account"
    );

    //For front later: http://yourdomain.com/verify-email?token=xyz

    /*const verificationUrl = `http://localhost:3000/verify-email?token=${emailVerificationToken}`;

    await emailManager(
      createdUser.email,
      "Please verify your email address to complete registration.",
      `<h1>Hello ${createdUser.name},</h1>
       <p>Click the link below to verify your email address:</p>
       <a href="${verificationUrl}">${verificationUrl}</a>
       <p>This link will expire in 24 hours.</p>`,
      "Verify Your Email - E-Commerce"
    );
    */

    res.status(201).json({
      status:
        "Registration successful! Please check your email to verify your account.",
    });
  } catch (error) {
    next(error);
  }
};

export default register;