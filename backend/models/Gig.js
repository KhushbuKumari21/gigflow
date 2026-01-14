import mongoose from "mongoose";

export default mongoose.model(
  "Gig",
  new mongoose.Schema({
    title: String,
    description: String,
    budget: Number,
    ownerId: mongoose.Schema.Types.ObjectId,
    status: { type: String, default: "open" }
  })
);
