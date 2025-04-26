import { Request, Response, NextFunction } from "express";
import User from "../../../models/user.model";
//import AppError from "../../../utils/AppError";
import { NotFoundError } from "../../../utils/errors";

const getProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) throw new NotFoundError("User not found with this email.");

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export default getProfile;