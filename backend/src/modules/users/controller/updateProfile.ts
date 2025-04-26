import { Request, Response, NextFunction } from "express";
import User from "../../../models/user.model";
import { UpdateProfileZodSchema } from "../../../validators/user.validator";
import { NotFoundError } from "../../../utils/errors";

const updateProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { success, data, error } = UpdateProfileZodSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: error.errors[0].message });
      return;
    }

    const userId = req.user?._id;
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    Object.assign(user, data); // updates only provided fields
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        isBanned: user.isBanned,
        image: user.image,
        address: user.address,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

export default updateProfile;