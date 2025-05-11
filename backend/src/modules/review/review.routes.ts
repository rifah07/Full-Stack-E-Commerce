import express from "express";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import createReview from "./controller/createReview";
import getProductReviews from "./controller/getProductReviews";
import updateReview from "./controller/updateReview";
import deleteReview from "./controller/deleteReview";

const reviewRoutes = express.Router();

reviewRoutes.get("/:productId/reviews", getProductReviews);

reviewRoutes.use(auth);
reviewRoutes.use(authorize("buyer"));

reviewRoutes.post("/:productId/reviews", createReview);
reviewRoutes.patch("/:productId/reviews/:reviewId", updateReview);
reviewRoutes.delete("/:productId/reviews/:reviewId", deleteReview)

export default reviewRoutes;