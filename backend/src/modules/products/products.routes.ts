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
import getSoftDeletedProducts from "./controller/getSoftDeletedProducts";
import restoreProduct from "./controller/restoreProduct";

const productRoutes = express.Router();

//public routes
productRoutes.get("/", getAllProducts);
productRoutes.get("/filteredProducts", getFilteredProducts);

//protected route
productRoutes.get(
  "/deleted",
  auth,
  authorize("seller", "admin"),
  getSoftDeletedProducts
);

// Seller-only route
productRoutes.get("/myProducts", auth, authorize("seller"), myProducts);

//public route but with query parameter
productRoutes.get("/:productId", getSingleProduct);


//protected - Only sellers/admins can create/delete
productRoutes.use(auth);
productRoutes.use(authorize("seller", "admin"));

productRoutes.post("/addProduct", createProduct);
productRoutes.patch("/:productId", updateProduct);
productRoutes.delete("/moveToTrash/:productId", softDeleteProduct);
productRoutes.patch("/restoreProduct/:productId", restoreProduct);
productRoutes.delete("/completeDelete/:productId", deleteProduct);

export default productRoutes;