import { Router } from 'express';
import { addToCart } from './controller/addToCart';
import auth from '../../middlewares/authMiddleware';
import authorize from '../../middlewares/authorize';

const cartRoures = Router();


cartRoures.use(auth);
cartRoures.use(authorize("buyer"));
cartRoures.post('/add', addToCart);

export default cartRoures;