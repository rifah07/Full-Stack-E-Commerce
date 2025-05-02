import express from "express";
import paypalPayment from "./controller/paypalPayment";
import stripePayment from "./controller/stripePayment";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
const paymentRoutes = express.Router();

paymentRoutes.use(auth);
paymentRoutes.use(authorize("buyer"));

paymentRoutes.post("/stripe", stripePayment);
paymentRoutes.post("/paypal", paypalPayment);

export default paymentRoutes;