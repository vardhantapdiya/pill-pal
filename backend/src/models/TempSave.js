// src/models/TempSave.js
const mongoose = require("mongoose");

const tempSaveSchema = new mongoose.Schema({
  tempId: { type: String, required: true, index: true }, // generated and returned to client
  medicineName: { type: String, required: true }, // original searched medicine (display)
  normalizedMedicine: { type: String, required: true, lowercase: true, index: true },
  alternative: {
    name: { type: String, required: true },
    price: { type: String, required: true },
    link: { type: String, default: null },
  },
  createdAt: { type: Date, default: Date.now },
});

// TTL - auto-delete temp saves after TTL seconds
const ttlSeconds = parseInt(process.env.TEMP_SAVE_TTL_SECONDS || "86400", 10); // default 1 day
tempSaveSchema.index({ createdAt: 1 }, { expireAfterSeconds: ttlSeconds });

// Avoid duplicate temp saves for same tempId + medicine + alt name
tempSaveSchema.index({ tempId: 1, normalizedMedicine: 1, "alternative.name": 1 }, { unique: true });

module.exports = mongoose.model("TempSave", tempSaveSchema);
