import express from "express";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";
import {
  addReview,
  approveReview,
  deleteOwnReview,
  deleteReview,
  getReviewsAdmin,
  getReviewsApprovedCountByRecipe,
  getReviewsByRecipe,
  getReviewsByUser,
  getReviewsByUserAndRecipe,
} from "../controllers/review.js";

const router = express.Router();

router.get("/byrecipe", getReviewsByRecipe);
router.get("/byuser", verifyUser, getReviewsByUser);
router.get("/byusernrecipe", getReviewsByUserAndRecipe);
router.get("/getcountapproved", getReviewsApprovedCountByRecipe);

router.get("/getadmin", getReviewsAdmin);

router.post("/add", verifyUser, addReview);

router.patch("/approve/:reviewId", verifyAdmin, approveReview);

router.delete("/userdelete", verifyUser, deleteOwnReview);
router.delete("/:reviewId", verifyAdmin, deleteReview);

export default router;
