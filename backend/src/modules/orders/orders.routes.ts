import express from "express";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import createOrder from "./controller/createOrder";

const orderRoutes = express.Router();

//protected - Only sellers/admins can create/delete
orderRoutes.use(auth);

orderRoutes.use(authorize("buyer"));

orderRoutes.post("/placeOrder", createOrder);

export default orderRoutes;
