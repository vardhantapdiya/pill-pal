// src/models/SavedAlternative.js
const mongoose = require("mongoose");

const savedAltSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
  name: { type: String, required: true },   // e.g., "Hemogold"
  price: { type: String, required: true },  // e.g., "120 INR"
  link: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

// prevent duplicate saved alternative for same user + medicine + name
savedAltSchema.index({ user: 1, medicine: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("SavedAlternatives", savedAltSchema); //added an s, remove if any issues.
