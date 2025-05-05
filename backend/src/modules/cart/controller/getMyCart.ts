import { Response, NextFunction } from "express";
import Cart from "../../../models/cart.model";
import { AuthRequest } from "../../../middlewares/authMiddleware";
import { NotFoundError, UnauthorizedError } from "../../../utils/errors";
import { IProduct } from "../../../models/product.model";

const getMyCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new UnauthorizedError("Unauthorized"));

    const cart = await Cart.findOne({ buyer: userId }).populate({
      path: "items.product",
      select: "_id name price stock imageUrl", // Add fields want to show
    });

    if (!cart || cart.items.length === 0) {
      return next(new NotFoundError("Your cart is empty"));
    }

    res.status(200).json({
      status: "success",
      message: "Cart retrieved successfully",
      data: {
        cartId: cart._id,

        items: cart.items.map((item) => {
          const product = item.product as IProduct;
          return {
            productId: product._id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            imageUrl: product.images,
            quantity: item.quantity,
            subtotal: item.quantity * product.price,
          };
        }),
        totalAmount: cart.items.reduce((sum, item) => {
          const product = item.product as IProduct;
          return sum + item.quantity * product.price;
        }, 0),
        shippingAddress: cart.defaultShippingAddress,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getMyCart;
