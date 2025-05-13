import { Router } from 'express';
import { addToCart } from './controller/addToCart';
import auth from '../../middlewares/authMiddleware';
import authorize from '../../middlewares/authorize';
import getMyCart from './controller/getMyCart';
import removeFromCart from './controller/removeFromCart';

const cartRoutes = Router();


cartRoutes.use(auth);
cartRoutes.use(authorize("buyer"));
cartRoutes.post('/add', addToCart);
cartRoutes.get('/my-cart', getMyCart);
cartRoutes.delete("/remove/:productId", removeFromCart);

export default cartRoutes;