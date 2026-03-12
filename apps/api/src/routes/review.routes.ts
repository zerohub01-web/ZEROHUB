import { Router } from "express";
import {
  submitReview,
  getOwnReview,
  getApprovedReviews,
  getAllReviews,
  approveReview,
  deleteReview
} from "../controllers/review.controller.js";
import { requireCustomerAuth } from "../middleware/customerAuth.js";
import { requireAuth as requireAdminAuth } from "../middleware/auth.js";

const router = Router();

// PUBLIC
router.get("/public", getApprovedReviews);

// CLIENT (protected)
router.post("/", requireCustomerAuth, submitReview);
router.get("/mine", requireCustomerAuth, getOwnReview);

// ADMIN (protected)
router.get("/admin/all", requireAdminAuth, getAllReviews);
router.patch("/admin/:id/approve", requireAdminAuth, approveReview);
router.delete("/admin/:id", requireAdminAuth, deleteReview);

export default router;
