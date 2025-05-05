import express from "express";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import addToWishlist from "./controller/addToWishlist";

const wishlistRoutes = express.Router();

//protected Routes
wishlistRoutes.use(auth);
wishlistRoutes.use(authorize("buyer"));

wishlistRoutes.post("/add", addToWishlist);

//router.get("/", getUserWishlist);
//router.delete("/remove/:productId", removeFromWishlist);

export default wishlistRoutes;