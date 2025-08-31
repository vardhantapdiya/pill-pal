const express = require("express");
const router = express.Router();
const fetchAlternatives = require("../utils/geminiClient");

// POST /api/search
router.post("/", async (req, res) => {
  try {
    const { medicineName } = req.body;
    if (!medicineName) {
      return res.status(400).json({ success: false, message: "Medicine name required" });
    }

    const result = await fetchAlternatives(medicineName);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
