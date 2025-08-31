const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  code: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// TTL index (auto delete after X seconds)
const ttlSeconds = parseInt(process.env.OTP_TTL_SECONDS || "300", 10);
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: ttlSeconds });

module.exports = mongoose.model("Otp", otpSchema);
