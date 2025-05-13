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
import updateProductDiscount from "./controller/updateProductDiscount";
import askProductQuestion from "./controller/askProductQuestion";

const productRoutes = express.Router();

//public routes
productRoutes.get("/", getAllProducts);
productRoutes.get("/filteredProducts", getFilteredProducts);

//protected route
productRoutes.post(
  "/addProduct",
  auth,
  authorize("seller", "admin"),
  createProduct
);

productRoutes.get(
  "/deleted",
  auth,
  authorize("seller", "admin"),
  getSoftDeletedProducts
);

//admin only routes
productRoutes.patch(
  "/:productId/discount",
  auth,
  authorize("admin"),
  updateProductDiscount
);

// Seller-only route
productRoutes.get("/myProducts", auth, authorize("seller"), myProducts);
productRoutes.patch(
  "/seller/:productId/discount",
  auth,
  authorize("seller"),
  updateProductDiscount
);

//buyer only routes
productRoutes.post(
  "/:productId/questions",
  auth,
  authorize("buyer"),
  askProductQuestion
);

//public route but with query parameter
productRoutes.get("/:productId", getSingleProduct);

//protected - Only sellers/admins can create/delete
productRoutes.use(auth);
productRoutes.use(authorize("seller", "admin"));

productRoutes.patch("/:productId", updateProduct);
productRoutes.delete("/moveToTrash/:productId", softDeleteProduct);
productRoutes.patch("/restoreProduct/:productId", restoreProduct);
productRoutes.delete("/completeDelete/:productId", deleteProduct);

export default productRoutes;
