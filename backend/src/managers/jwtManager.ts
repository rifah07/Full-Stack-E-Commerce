import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();

const jwtManager = (user: IUser): string => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1d", // accessToken expires in 1 day
  });

  return accessToken;
};

export default jwtManager;