import express from "express";
import auth from "../../middlewares/authMiddleware";
import authorize from "../../middlewares/authorize";
import createReview from "./controller/createReview";

const reviewRoutes = express.Router();

reviewRoutes.use(auth);
reviewRoutes.use(authorize("buyer"));

reviewRoutes.post("/:productId/reviews", createReview);

export default reviewRoutes;