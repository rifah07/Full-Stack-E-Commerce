import express from "express";
import createProduct from "./controller/createProduct";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import getAllProducts from "./controller/getAllProducts";
import getSingleProduct from "./controller/getSingleProduct";

const productRoutes = express.Router();

// Public routes
productRoutes.get("/", getAllProducts);
productRoutes.get("/:productId", getSingleProduct);


// Protected - Only sellers/admins can create/delete
productRoutes.use(auth);

productRoutes.post("/addProduct", authorize("seller", "admin"), createProduct);

export default productRoutes;