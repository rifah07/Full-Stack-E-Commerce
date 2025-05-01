import { Response, NextFunction } from 'express';
import Product from '../../../models/product.model';
import { AuthRequest } from '../../../middlewares/authMiddleware';
import { ForbiddenError } from '../../../utils/errors';

export const getSoftDeletedProducts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
        throw new ForbiddenError('Only administrators can access deleted products');
      }
    const deletedProducts = await Product.find({ isDeleted: true });

    res.status(200).json({
      message: 'Soft-deleted products fetched successfully',
      data: deletedProducts,
    });
  } catch (error) {
    next(error);
  }
};