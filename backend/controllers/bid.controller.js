import mongoose from "mongoose";
import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";

// CREATE BID
export const createBid = async (req, res) => {
  try {
    const bid = await Bid.create({
      ...req.body,
      freelancerId: req.user.id,
    });
    res.status(201).json(bid);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create bid" });
  }
};

// GET BIDS FOR A GIG → ONLY OWNER CAN ACCESS
export const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    // Find the gig
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ msg: "Gig not found" });

    // Access control: Only gig owner can see bids
    if (gig.ownerId.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized access" });

    const bids = await Bid.find({ gigId });
    res.json(bids);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch bids" });
  }
};

// HIRE BID (TRANSACTIONAL)
export const hireBid = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bid = await Bid.findById(req.params.bidId).session(session);
    if (!bid) throw new Error("Bid not found");

    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) throw new Error("Gig not found");

    // Only owner can hire
    if (gig.ownerId.toString() !== req.user.id)
      throw new Error("Unauthorized action");

    if (gig.status === "assigned") throw new Error("Already hired");

    // Reject all other bids
    await Bid.updateMany({ gigId: gig._id }, { status: "rejected" }, { session });

    // Hire the selected bid
    bid.status = "hired";
    await bid.save({ session });

    // Update gig status
    gig.status = "assigned";
    await gig.save({ session });

    await session.commitTransaction();
    res.json({ success: true });
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

// UPDATE BID → Only bid owner can update
export const updateBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ msg: "Bid not found" });

    // Only bid owner can update
    if (bid.freelancerId.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    bid.price = req.body.price || bid.price;
    bid.message = req.body.message || bid.message;

    await bid.save();
    res.json(bid);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update bid" });
  }
};

// DELETE BID → Only bid owner can delete
export const deleteBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ msg: "Bid not found" });

    // Only bid owner can delete
    if (bid.freelancerId.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    await bid.deleteOne();
    res.json({ msg: "Bid deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete bid" });
  }
};
