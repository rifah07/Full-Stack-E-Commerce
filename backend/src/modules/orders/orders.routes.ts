import express, { Request, Response, NextFunction } from "express";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import createOrder, { createOrderValidation } from "./controller/createOrder";
import getAllOrders from "./controller/getAllOrders";
import getMyOrders from "./controller/getMyOrders";
import updateOrderStatus from "./controller/updateOrderStatus";
import cancelOrder from "./controller/cancelOrder";
import getSellerOrders from "./controller/getSellerOrders";
import getSellerOrderById from "./controller/getSellerOrderById";
import { body, param, validationResult } from "express-validator";
import { BadRequestError } from "../../utils/errors";

const orderRoutes = express.Router();

// middleware to handle validation errors
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new BadRequestError(
        "Validation failed: " + JSON.stringify(errors.array())
      )
    );
  }
  next();
};

//protected - Only sellers/admins can create/delete, view all orders
orderRoutes.use(auth);

//Route only for admin(s)
//orderRoutes.use(authorize("admin"));
orderRoutes.get("/all", authorize("admin"), getAllOrders);

//Route only for sellers
//orderRoutes.use(authorize("seller"));

//Route only for buyers
//orderRoutes.use(authorize("buyer"));

orderRoutes.post(
  "/placeOrder",
  authorize("buyer"),
  createOrderValidation,
  validate,
  createOrder
);
orderRoutes.get("/my-orders", authorize("buyer"), getMyOrders);
orderRoutes.get("/seller/orders", authorize("seller"), getSellerOrders);

orderRoutes.get(
  "/seller/:orderId",
  authorize("seller"),
  [param("orderId").isMongoId().withMessage("Invalid order ID")],
  validate,
  getSellerOrderById
);
orderRoutes.patch(
  "/:orderId/status",
  authorize("admin", "seller"),
  [
    param("orderId").isMongoId().withMessage("Invalid order ID"),
    body("status")
      .notEmpty()
      .isIn(["pending", "processing", "shipped", "delivered", "cancelled"])
      .withMessage("Invalid order status"),
  ],
  validate,
  updateOrderStatus
);
orderRoutes.patch(
  "/:orderId/cancel",
  authorize("buyer"),
  [param("orderId").isMongoId().withMessage("Invalid order ID")],
  validate,
  cancelOrder
);

export default orderRoutes;
