import { Request, Response, NextFunction } from "express";
import User from "../../../models/user.model";
import { NotFoundError } from "../../../utils/errors";
import catchAsync from "../../../utils/catchAsync";

/**
 * Admin only: Unban a user by ID
 */
const unbanUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    user.isBanned = false;
    await user.save();

    res.status(200).json({
      status: "Success",
      message: "User unbanned successfully.",
    });
  }
);

export default unbanUser;
