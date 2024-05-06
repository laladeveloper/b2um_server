import express from "express";
import {
  allReviews,
  createReview,
  deleteReview,
  getReview,
  updateReview,
} from "../controllers/reviewCtrl.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/all").get(allReviews);
router.route("/new/:id").post(protect, createReview);
router
  .route("/:id")
  .get(getReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;
