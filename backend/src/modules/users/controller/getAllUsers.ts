import { Request, Response, NextFunction } from "express";
import User from "../../../models/user.model";
import catchAsync from "../../../utils/catchAsync";

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find().select("-password");

    res.status(200).json({
      status: "Success",
      totalUsers: users.length,
      users,
    });
  }
);

export default getAllUsers;