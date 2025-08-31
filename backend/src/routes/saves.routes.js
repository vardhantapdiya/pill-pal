// src/routes/saves.routes.js
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const authMiddleware = require("../middleware/auth.middleware");

const Medicine = require("../models/Medicine");
const SavedAlternative = require("../models/SavedAlternatives")
const TempSave = require("../models/TempSave");

const router = express.Router();

/**
 * POST /api/saves/temp
 * Body: { tempId? , medicineName, alternative: { name, price, link } }
 * If tempId not provided, server will generate one and return it.
 * Frontend should store returned tempId in localStorage.
 */
router.post("/temp", async (req, res) => {
  try {
    const { tempId: clientTempId, medicineName, alternative } = req.body;
    if (!medicineName || !alternative || !alternative.name || !alternative.price) {
      return res.status(400).json({ error: "medicineName and alternative (name, price) required" });
    }

    const tempId = clientTempId || uuidv4();
    const normalizedMedicine = String(medicineName).toLowerCase().trim();

    // Upsert one temp save; unique index avoids duplicates
    try {
      await TempSave.create({
        tempId,
        medicineName,
        normalizedMedicine,
        alternative: {
          name: alternative.name,
          price: alternative.price,
          link: alternative.link || null,
        },
      });
    } catch (err) {
      // If unique constraint violation (duplicate), ignore and return success
      if (err.code === 11000) {
        return res.status(200).json({ tempId, message: "Already saved temporarily" });
      }
      throw err;
    }

    return res.status(201).json({ tempId, message: "Saved temporarily" });
  } catch (err) {
    console.error("Temp save error:", err.message);
    return res.status(500).json({ error: "Failed to save temporarily" });
  }
});

/**
 * POST /api/saves/merge
 * Body: { tempId }
 * Protected route: user must be logged in (Bearer token)
 * This endpoint moves all TempSave entries for tempId into SavedAlternative for the logged-in user
 */
router.post("/merge", authMiddleware, async (req, res) => {
  try {
    const { tempId } = req.body;
    if (!tempId) return res.status(400).json({ error: "tempId required" });

    // find temp saves
    const tempSaves = await TempSave.find({ tempId });
    if (!tempSaves || tempSaves.length === 0) {
      return res.status(200).json({ merged: 0, message: "No temporary saves to merge" });
    }

    const results = { merged: 0, skipped: 0, details: [] };

    for (const ts of tempSaves) {
      // 1) get or create Medicine
      const med = await Medicine.findOneAndUpdate(
        { normalized: ts.normalizedMedicine },
        { $setOnInsert: { name: ts.medicineName, normalized: ts.normalizedMedicine } },
        { upsert: true, new: true }
      );

      // 2) Try to create SavedAlternative for this user
      try {
        const saved = await SavedAlternative.create({
          user: req.user._id,
          medicine: med._id,
          name: ts.alternative.name,
          price: ts.alternative.price,
          link: ts.alternative.link || null,
        });
        results.merged += 1;
        results.details.push({ savedId: saved._id, medicine: med.name, alt: saved.name });
      } catch (err) {
        // duplicate (11000) => skip
        if (err.code === 11000) {
          results.skipped += 1;
          results.details.push({ skipped: true, medicine: med.name, alt: ts.alternative.name });
        } else {
          // log but continue
          console.error("Error saving alternative during merge:", err.message);
          results.details.push({ error: err.message, medicine: med.name, alt: ts.alternative.name });
        }
      }
    }

    // Delete temp saves after attempt
    await TempSave.deleteMany({ tempId });

    return res.status(200).json({ merged: results.merged, skipped: results.skipped, details: results.details });
  } catch (err) {
    console.error("Merge error:", err.message);
    return res.status(500).json({ error: "Failed to merge temporary saves" });
  }
});

module.exports = router;
