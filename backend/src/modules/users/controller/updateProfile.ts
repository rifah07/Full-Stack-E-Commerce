import { Request, Response, NextFunction } from "express";
import User from "../../../models/user.model";
import { UpdateProfileZodSchema } from "../../../validators/user.validator";

const updateProfile = async (req: any, res: Response, next: NextFunction) => {
  try {
    const parsed = UpdateProfileZodSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: parsed.data },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export default updateProfile;