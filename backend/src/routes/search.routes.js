const express = require("express");
const router = express.Router();
const fetchAlternatives = require("../utils/geminiClient");
const redisClient = require("../utils/redisClient")

// POST /api/search
router.post("/", async (req, res) => {
  try {
    const { medicineName } = req.body;
    if (!medicineName) {
      return res.status(400).json({ success: false, message: "Medicine name required" });
    }

    const cacheKey = `medicine:${medicineName.toLowerCase()}`;

    const cachedResult = await redisClient.get(cacheKey);

     if (cachedResult) {
      console.log("⚡ Served from Redis cache");

      return res.status(200).json({
        success: true,
        source: "cache",
        data: JSON.parse(cachedResult)
      });
    }

    console.log("🌐 Fetching from Gemini API");
    const result = await fetchAlternatives(medicineName);

    await redisClient.set(cacheKey,
      JSON.stringify(result),
      { EX: 3600 }
    )

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
