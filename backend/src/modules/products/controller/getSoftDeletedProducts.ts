import { Response,  NextFunction } from 'express';
import Product from '../../../models/product.model';
import { AuthRequest } from '../../../middlewares/authMiddleware';
import { ForbiddenError } from '../../../utils/errors';


const getSoftDeletedProducts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ForbiddenError('Authentication required');
    }
    
    let deletedProducts;
    
    // Admin can see all soft-deleted products
    if (req.user.role === 'admin') {
      deletedProducts = await Product.find({ isDeleted: true });
    } 
    // Sellers can see only their own soft-deleted products
    else if (req.user.role === 'seller') {
      deletedProducts = await Product.find({ 
        isDeleted: true,
        seller: req.user.id 
      });
    } 
    else {
      throw new ForbiddenError('Insufficient permissions to access deleted products');
    }
    
    res.status(200).json({
      message: 'Soft-deleted products fetched successfully',
      data: deletedProducts,
    });
  } catch (error) {
    next(error);
  }
};

export default getSoftDeletedProducts 