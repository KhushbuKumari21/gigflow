import Gig from "../models/Gig.js";

// GET all open gigs with optional search
export const getGigs = async (req, res) => {
  try {
    const search = req.query.search || "";
    const gigs = await Gig.find({
      title: { $regex: search, $options: "i" },
      status: "open",
    });
    res.json(gigs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch gigs" });
  }
};

// CREATE a new gig
export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    // Validation
    if (!title || !description || !budget) {
      return res
        .status(400)
        .json({ msg: "Title, description, and budget are required" });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user.id,
    });

    res.status(201).json(gig);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create gig" });
  }
};
