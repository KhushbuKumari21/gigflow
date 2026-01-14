import express from "express";
import { 
  createBid, 
  getBidsForGig, 
  hireBid, 
  updateBid, 
  deleteBid 
} from "../controllers/bid.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create a new bid
router.post("/", protect, createBid);

// Get all bids for a gig → only gig owner can access
router.get("/:gigId", protect, getBidsForGig);

// Hire a bid (transactional) → only gig owner
router.patch("/:bidId/hire", protect, hireBid);

// Update a bid → only bid owner
router.patch("/:bidId", protect, updateBid);

// Delete a bid → only bid owner
router.delete("/:bidId", protect, deleteBid);

export default router;
