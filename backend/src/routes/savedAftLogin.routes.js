const express = require("express");
const SavedAlternative = require("../models/SavedAlternatives.js");
const Medicine = require("../models/Medicine.js");
const authMiddleware = require("../middleware/auth.middleware.js");

const router = express.Router();

/**
 * Save an alternative medicine
 * Route: POST /api/saved/save
 * Body: { medicineName, alternative }
 * alternative = { name, price, link }
 */
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { medicineName, alternative } = req.body;
    const userId = req.user._id;

    if (!medicineName || !alternative?.name) {
      return res.status(400).json({ message: "Medicine name and alternative are required" });
    }

    // 1. Find or create the parent Medicine doc
    let medicine = await Medicine.findOne({ normalized: medicineName.toLowerCase() });
    if (!medicine) {
      medicine = await Medicine.create({
        name: medicineName,
        normalized: medicineName.toLowerCase()
      });
    }

    // 2. Check if already saved by this user
    const existing = await SavedAlternative.findOne({
      user: userId,
      medicine: medicine._id,
      // "alternative.name": alternative.name //--I think we will need to change "alt.name" to just name 
      name: alternative.name //--I think we will need to change "alt.name" to just name 
    });

    if (existing) {
      return res.status(400).json({ message: "Already saved" });
    }

    // 3. Create new SavedAlternative
    const saved = await SavedAlternative.create({
      user: userId,
      medicine: medicine._id,
      // alternative
      name: alternative.name,
      price: alternative.price || "Price Unavailable",
      link: alternative.link
    });

    await saved.populate('medicine', 'name');

    res.status(201).json({
      message: "Alternative saved successfully",
      saved
    });

  } catch (error) {
    console.error("Save alternative error:", error);
    res.status(500).json({ message: "Server error",
       error: error.message
     });
  }
});

// ✅ Get all saved medicines for a user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const savedMeds = await SavedAlternative.find({ user: req.user._id })
      .populate("medicine") // get original searched medicine details
      .sort({ createdAt: -1 }); // newest first

    res.json(savedMeds);
  } catch (err) {
    console.error("Error fetching saved meds:", err.message);
    res.status(500).json({ error: "Failed to fetch saved medicines" });
  }
});

// ✅ Delete a saved medicine by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await SavedAlternative.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // ensure user owns this record
    });

    if (!deleted) {
      return res.status(404).json({ error: "Saved medicine not found" });
    }

    res.json({ message: "Medicine deleted successfully" });
  } catch (err) {
    console.error("Error deleting saved med:", err.message);
    res.status(500).json({ error: "Failed to delete medicine" });
  }
});

module.exports = router;