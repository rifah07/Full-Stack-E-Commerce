import { Response } from "express";
import User from "../../../models/user.model";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import logger from "../../../utils/logger";
//import AppError from "../../../utils/AppError";
import { NotFoundError, UnauthorizedError } from "../../../utils/errors";
import catchAsync from "../../../utils/catchAsync";

export const deleteUser = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) throw new UnauthorizedError("Unauthorized - Invalid token.");

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found with this email.");

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message:
        "Your account has been permanently deleted. We’re sad to see you go 💔",
      farewellNote: "If you change your mind, you're always welcome to rejoin!",
    });
    return;
  }
);
