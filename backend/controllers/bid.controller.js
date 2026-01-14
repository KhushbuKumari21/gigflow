import mongoose from "mongoose";
import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";

/* =========================
   CREATE BID
========================= */
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

/* =========================
   GET BIDS FOR A GIG
    Owner → all bids
    Freelancer → own bid
========================= */
export const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ msg: "Gig not found" });

    // Gig Owner → see all bids
    if (gig.ownerId.toString() === req.user.id) {
      const bids = await Bid.find({ gigId });
      return res.json(bids);
    }

    //  Freelancer → see only their bid
    const myBid = await Bid.findOne({
      gigId,
      freelancerId: req.user.id,
    });

    return res.json(myBid ? [myBid] : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch bids" });
  }
};

/* =========================
   HIRE BID (TRANSACTION)
========================= */
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

    if (gig.status === "assigned")
      throw new Error("Gig already assigned");

    // Reject all bids
    await Bid.updateMany(
      { gigId: gig._id },
      { status: "rejected" },
      { session }
    );

    // Hire selected bid
    bid.status = "hired";
    await bid.save({ session });

    gig.status = "assigned";
    await gig.save({ session });

    await session.commitTransaction();
    res.json({ success: true });
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(400).json({ msg: err.message });
  } finally {
    session.endSession();
  }
};

/* =========================
   UPDATE BID
========================= */
export const updateBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ msg: "Bid not found" });

    if (bid.freelancerId.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    bid.price = req.body.price ?? bid.price;
    bid.message = req.body.message ?? bid.message;

    await bid.save();
    res.json(bid);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update bid" });
  }
};

/* =========================
   DELETE BID
========================= */
export const deleteBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ msg: "Bid not found" });

    if (bid.freelancerId.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    await bid.deleteOne();
    res.json({ msg: "Bid deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete bid" });
  }
};
