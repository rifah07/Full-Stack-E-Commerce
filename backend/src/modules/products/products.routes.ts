import express from "express";
import createProduct from "./controller/createProduct";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import getAllProducts from "./controller/getAllProducts";
import getSingleProduct from "./controller/getSingleProduct";
import deleteProduct from "./controller/deleteProduct";
import updateProduct from "./controller/updateProduct";
import softDeleteProduct from "./controller/softDeleteProduct";
import getFilteredProducts from "./controller/getFilteredProducts";
import myProducts from "./controller/myProducts";

const productRoutes = express.Router();

//public routes
productRoutes.get("/", getAllProducts);
productRoutes.get("/filteredProducts", getFilteredProducts);

//protected route
productRoutes.get("/myProducts", auth, authorize("seller"), myProducts); // requires auth + seller role

//public product detail route
productRoutes.get("/:productId", getSingleProduct);

//protected - Only sellers/admins can create/delete
productRoutes.use(auth);

productRoutes.use(authorize("seller", "admin"));

productRoutes.post("/addProduct", createProduct);
productRoutes.patch("/:productId", updateProduct);
productRoutes.delete("/:productId", softDeleteProduct);
productRoutes.delete("/completeDelete/:productId", deleteProduct);

export default productRoutes;
