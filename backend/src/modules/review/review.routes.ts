import express from "express";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import createReview from "./controller/createReview";
import getProductReviews from "./controller/getProductReviews";

const reviewRoutes = express.Router();

reviewRoutes.get("/:productId/reviews", getProductReviews);

reviewRoutes.use(auth);
reviewRoutes.use(authorize("buyer"));

reviewRoutes.post("/:productId/reviews", createReview);

export default reviewRoutes;