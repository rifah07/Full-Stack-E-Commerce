import { z } from "zod"; // Importing Zod
// import * as yup from 'yup'; // Importing Yup - uncomment if prefer Yup

// --- Yup Validation Schema (Alternative if needed) ---
// export const UserYupSchema = yup.object().shape({
//   name: yup.string().min(2).max(100).required(),
//   email: yup.string().email().required(),
//   password: yup.string().min(6).required(),
//   role: yup.mixed<IUser["role"]>().oneOf(["admin", "seller", "buyer"]).default("buyer").required(),
//   isBanned: yup.boolean().default(false).required(),
//   emailVerificationToken: yup.string().optional(),
//   isVerified: yup.boolean().optional().default(false),
//   emailVerificationExpires: yup.date().optional(),
//   resetPasswordToken: yup.string().optional(),
//   resetPasswordExpires: yup.date().optional(),
//   createdAt: yup.date().optional(),
//   updatedAt: yup.date().optional(),
//   __v: yup.number().optional(),
//   _id: yup.string().optional(), // Mongoose ObjectId
// });

// --- Zod Validation Schema ---
export const UserZodSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "seller", "buyer"]).default("buyer"),
  isBanned: z.boolean().default(false),
  emailVerificationToken: z.string().optional(),
  isVerified: z.boolean().optional().default(false),
  emailVerificationExpires: z.date().optional(),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpires: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  __v: z.number().optional(),
  _id: z.string().optional(), // Mongoose ObjectId
});

// specific Zod schema for registration
export const RegisterZodSchema = z
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

// Zod schema for resend verification
export const ResendVerificationZodSchema = z.object({
  email: z.string().email({ message: "Please enter a valid e-mail address." }),
});

// Zod schema for login
export const LoginZodSchema = z.object({
  email: z.string().email({ message: "Please enter a valid e-mail address." }),
  password: z.string().min(1, { message: "Password cannot be empty." }),
});

//Zod schema for forgot password
export const ForgotPasswordZodSchema = z.object({
  email: z.string().email({ message: "Please enter a valid e-mail address." }),
});

// Zod schema for reset password request body
export const ResetPasswordZodSchema = z.object({
  newPassword: z
    .string()
    .min(6, { message: "New password must be at least 6 characters long." }),
});

// Zod schema for change password
export const ChangePasswordZodSchema = z.object({
  currentPassword: z
    .string()
    .min(6, { message: "Current password is required." }),
  newPassword: z
    .string()
    .min(6, { message: "New password must be at least 6 characters long." }),
});

// Zod schema for updating profile
export const UpdateProfileZodSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  address: z.string().max(255).optional(),
  image: z.string().optional(), // base64 or URL
});