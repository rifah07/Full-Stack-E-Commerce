import express from "express";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import addToWishlist from "./controller/addToWishlist";
import getUserWishlist from "./controller/getUserWishlist";
import removeFromWishlist from "./controller/removeFromWishlist";

const wishlistRoutes = express.Router();

//protected Routes
wishlistRoutes.use(auth);
wishlistRoutes.use(authorize("buyer"));

wishlistRoutes.post("/add", addToWishlist);
wishlistRoutes.get("/", getUserWishlist);
wishlistRoutes.delete("/remove/:productId", removeFromWishlist);

export default wishlistRoutes;