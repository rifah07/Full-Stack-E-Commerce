import { Request, Response, NextFunction } from "express";
import User from "../../../models/user.model";
import { NotFoundError } from "../../../utils/errors";
import catchAsync from "../../../utils/catchAsync";

/**
 * Admin only: Ban a user by ID
 */
const banUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    user.isBanned = true;
    await user.save();

    res.status(200).json({
      message: "User has been banned successfully.",
    });
  }
);

export default banUser;
