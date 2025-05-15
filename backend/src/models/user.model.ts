/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: User's full name
 *           example: "A Merrie"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "a@gmail.com"
 *         password:
 *           type: string
 *           format: password
 *           description: User's hashed password
 *           example: "123456"
 *         role:
 *           type: string
 *           enum: [admin, seller, buyer]
 *           default: buyer
 *           description: User's role in the system
 *           example: "seller"
 *         isBanned:
 *           type: boolean
 *           default: false
 *           description: Whether user account is banned
 *         image:
 *           type: string
 *           description: URL to user's profile image
 *         address:
 *           type: string
 *           description: User's address
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: User's gender
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: User's date of birth
 *         isVerified:
 *           type: boolean
 *           default: false
 *           description: Whether user's email is verified
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when user was last updated
 */

import mongoose, { Document, Schema } from "mongoose";

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
  image?: string;
  address?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: Date;
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
    image: { type: String },
    address: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    dateOfBirth: { type: Date },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// this part formats variable value in lowarcase to maintain if entered in different case formates
userSchema.pre<IUser>("save", function (next) {
  this.role = this.role.toLowerCase() as IUser["role"];
  //this.gender = this.gender.toLowerCase() as IUser["gender"];
  next();
});

// Below line creates the model named "User" from the schema userSchema
// It exports it as the default export
export default mongoose.model<IUser>("User", userSchema);