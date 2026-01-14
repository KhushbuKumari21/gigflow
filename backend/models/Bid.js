import mongoose from "mongoose";

export default mongoose.model(
  "Bid",
  new mongoose.Schema({
    gigId: mongoose.Schema.Types.ObjectId,
    freelancerId: mongoose.Schema.Types.ObjectId,
    message: String,
    price: Number,
    status: { type: String, default: "pending" }
  })
);
