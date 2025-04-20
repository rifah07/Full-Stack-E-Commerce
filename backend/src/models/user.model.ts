import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod"; // Importing Zod
// import * as yup from 'yup'; // Importing Yup - uncomment if prefer Yup

// In TypeScript, an interface defines the shape (or structure) of an object —
// like what properties it has and what their types are.

// In this case, the interface IUser is telling TypeScript what a User document
//  should look like in MongoDB.

// IUser is an object that must have all the fields we
// define (name, email, etc), and it also includes everything
// a normal Mongoose Document has (like _id, createdAt, etc).

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "seller" | "buyer";
  isBanned: boolean;
  emailVerificationToken?: string;
  isVerified?: boolean;
  emailVerificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

// So any object that says it’s an IUser must have those fields above.

// Mongoose Schema
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "seller", "buyer"],
      default: "buyer",
    },
    isBanned: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// this part formats role in lowarcase to maintain if entered in different case formates
userSchema.pre<IUser>("save", function (next) {
  this.role = this.role.toLowerCase() as IUser["role"];
  next();
});

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

// specific Zod schema for login

export const LoginZodSchema = z.object({
  email: z.string().email({ message: "Please enter a valid e-mail address." }),
  password: z.string().min(1, { message: "Password cannot be empty." }),
});

// Zod schema for change password
export const ChangePasswordZodSchema = z.object({
  currentPassword: z.string().min(6, { message: "Current password is required." }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters long." }),
});

// Below line creates the model named "User" from the schema userSchema
// It exports it as the default export
export default mongoose.model<IUser>("User", userSchema);