import { Request, Response, NextFunction } from "express";
import User from "../../../models/user.model";
import { BadRequestError, NotFoundError } from "../../../utils/errors";
import catchAsync from "../../../utils/catchAsync";
import Product from "../../../models/product.model";

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

    if (user.isBanned) {
      throw new BadRequestError("User is already banned");
    }

    user.isBanned = true;
    await user.save();

    // Soft-delete all products if the user is a seller
    if (user.role === "seller") {
      await Product.updateMany(
        { seller: user._id },
        { $set: { isDeleted: true } }
      );
    }
    res.status(200).json({
      message: `User (${user.email}) has been banned successfully.`,
    });
  }
);

export default banUser;
