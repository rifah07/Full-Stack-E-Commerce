import mongoose, { Document, Schema } from "mongoose";

//In TypeScript, an interface defines the shape (or structure) of an object —
// like what properties it has and what their types are.

//In this case, the interface IUser is telling TypeScript what a User document
//  should look like in MongoDB.

//IUser is an object that must have all the fields we
// define (name, email, etc), and it also includes everything
// a normal Mongoose Document has (like _id, createdAt, etc).

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "seller" | "buyer";
  isBanned: boolean;
  emailVerificationToken?: string;
  emailVerified?: boolean;
  emailVerificationExpires?: Date;
}

//So any object that says it’s an IUser must have those fields above.

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
    emailVerified: { type: Boolean, default: false },
    emailVerificationExpires: { type: Date },
  },
  { timestamps: true }
);

//this part formats role in lowarcase to maintain if entered in different case formates
userSchema.pre<IUser>("save", function (next) {
  this.role = this.role.toLowerCase() as IUser["role"];
  next();
});

//Below line creates the model named "User" from the schema userSchema
//It exports it as the default export
export default mongoose.model<IUser>("User", userSchema);