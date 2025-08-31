// src/models/Medicine.js
const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true }, // display name (original case)
  normalized: { type: String, required: true, lowercase: true, index: true }, // lowercased key
  createdAt: { type: Date, default: Date.now },
});

medicineSchema.index({ normalized: 1 }, { unique: true });

module.exports = mongoose.model("Medicine", medicineSchema);
