// backend/src/routes/product.routes.ts (example)
import express from "express";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import createReview from "./controller/createReview";

const reviewRoute = express.Router();

reviewRoute.use(auth);
reviewRoute.use(authorize("buyer"));

reviewRoute.post("/:productId/reviews", createReview);

export default reviewRoute;