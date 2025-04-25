import { Request, Response, NextFunction } from "express";
import User from "../../../models/user.model";
import AppError from "../../../utils/AppError";

const getProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) throw new AppError("User not found with this email.", 404);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export default getProfile;