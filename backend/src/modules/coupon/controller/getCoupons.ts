import { Request, Response, NextFunction } from "express";
import Coupon from "../../../models/coupon.model";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import { UnauthorizedError } from "../../../utils/errors";

const getCoupons = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required."));
    }

    if (req.user.role === "admin") {
      // Admin: fetch all coupons, segmented by creator (admin vs. seller)
      const adminCoupons = await Coupon.find({ seller: { $exists: false } });
      const sellerCoupons = await Coupon.find({ seller: { $exists: true } }).populate("seller", "firstName lastName");
      const totalAdminCoupons = adminCoupons.length;
      const totalSellerCoupons = sellerCoupons.length;
      const totalCoupons = totalAdminCoupons + totalSellerCoupons;

      res.status(200).json({
        status: "success",
        data: {
          adminCoupons,
          totalAdminCoupons,
          sellerCoupons,
          totalSellerCoupons,
          totalCoupons,
        },
      });
    } else if (req.user.role === "seller") {
      // Seller: fetch only their own coupons
      const sellerId = req.user.id;
      const coupons = await Coupon.find({ seller: sellerId });
      const totalCoupons = coupons.length;

      res.status(200).json({
        status: "success",
        data: {
          coupons,
          totalCoupons,
        },
      });
    } else {
      return next(new UnauthorizedError("Unauthorized access."));
    }
  } catch (error) {
    next(error);
  }
};

export default getCoupons;