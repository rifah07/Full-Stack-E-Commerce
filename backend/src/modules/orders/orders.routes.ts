import express from "express";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import createOrder from "./controller/createOrder";
import getAllOrders from "./controller/getAllOrders";
import getMyOrders from "./controller/getMyOrders";
import updateOrderStatus from "./controller/updateOrderStatus";
import cancelOrder from "./controller/cancelOrder";
import getSellerOrders from "./controller/getSellerOrders";

const orderRoutes = express.Router();

//protected - Only sellers/admins can create/delete, view all orders
orderRoutes.use(auth);

//Route only for admin(s)
//orderRoutes.use(authorize("admin"));
orderRoutes.get("/all", authorize("admin"), getAllOrders);


//Route only for sellers
//orderRoutes.use(authorize("seller"));

//Route only for buyers
//orderRoutes.use(authorize("buyer"));

orderRoutes.post("/placeOrder",authorize("buyer"), createOrder);
orderRoutes.get("/my-orders",authorize("buyer"), getMyOrders);
orderRoutes.get("/seller/orders", authorize("seller"), getSellerOrders);


orderRoutes.patch(
    "/:orderId/status",
    authorize("admin", "seller"),
    updateOrderStatus
  );
  orderRoutes.patch(
    "/:orderId/cancel",
    authorize("buyer"),
    cancelOrder
  );

export default orderRoutes;