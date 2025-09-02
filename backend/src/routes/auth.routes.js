const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Otp = require("../models/Otp");
const { generateOtp } = require("../utils/otpGen");
const { sendMail } = require("../utils/email");

const router = express.Router();

// Helper: sign JWT
const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * 1) Signup - store OTP + passwordHash temporarily
 */
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: "User already exists" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // generate OTP
    const code = generateOtp();

    // save OTP + hashed password in OTP collection
    await Otp.create({
      email: email.toLowerCase(),
      code,
      passwordHash,
    });

    // send OTP to email
    await sendMail(
      email,
      "Your verification OTP",
      `<p>Dear User,</p>
      <p>Your One-Time Password (OTP) is: <b>${code}</b>.</p>
      <p>For your security, please note that this code will expire in <b>${process.env.OTP_TTL_SECONDS || 300}
      </b> seconds.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thank you,<br>Team Pill-Pal</p>`
    );

    return res
      .status(201)
      .json({ message: "OTP sent to email. Please verify to complete signup." });
  } catch (err) {
    console.error("Signup error:", err.message);
    return res.status(500).json({ error: "Signup failed" });
  }
});

/**
 * 2) Resend OTP
 */
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const code = generateOtp();

    // update OTP doc or create new one
    await Otp.findOneAndUpdate(
      { email: email.toLowerCase() },
      { code },
      { upsert: true, new: true }
    );

    await sendMail(
      email,
      "Your verification OTP (resend)",
      `<p>Dear User,</p>
      <p>Your One-Time Password (OTP) is: <b>${code}</b>.</p>
      <p>For your security, please note that this code will expire in <b>${process.env.OTP_TTL_SECONDS || 300}
      </b> seconds.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thank you,<br>Team Pill-Pal</p>`
    );

    return res.json({ message: "OTP resent" });
  } catch (err) {
    console.error("Resend OTP error:", err.message);
    return res.status(500).json({ error: "Failed to resend OTP" });
  }
});

/**
 * 3) Verify OTP - create actual User
 */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Email and code required" });
    }

    // 1. Find OTP doc
    const otpDoc = await Otp.findOne({ email: email.toLowerCase(), code });
    if (!otpDoc) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // 2. Check if user already exists (edge case: if signup happened twice)
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Create new user from OTP’s passwordHash
      user = await User.create({
        email: email.toLowerCase(),
        passwordHash: otpDoc.passwordHash,
        isVerified: true,
      });
    } else {
      // If user exists but not verified, just mark as verified
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
    }

    // 3. Clean up OTPs for this email
    await Otp.deleteMany({ email: email.toLowerCase() });

    // 4. Issue JWT
    const token = signToken({ id: user._id, email: user.email });

    return res.json({ message: "Verified", token });
  } catch (err) {
    console.error("Verify OTP error:", err.message);
    return res.status(500).json({ error: "Failed to verify OTP" });
  }
});

/**
 * 4) Login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: "User Does not Exist, please sign up" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ error: "Wrong Password" });

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ error: "Account not verified. Please verify OTP." });
    }

    const token = signToken({ id: user._id, email: user.email });
    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ error: "Login failed" });
  }
});

/**
 * 5) Forgot Password - send OTP
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: "User not found" });

    const code = generateOtp();

    await Otp.findOneAndUpdate(
      { email: email.toLowerCase() },
      { code, passwordHash: null }, // reset OTP doc without password
      { upsert: true, new: true }
    );

    await sendMail(
      email,
      "Your password reset OTP",
      `<p>Dear User,</p>
      <p>Your One-Time Password (OTP) for resetting your password is: <b>${code}</b>.</p>
      <p>This code will expire in <b>${process.env.OTP_TTL_SECONDS || 300}
      </b> seconds. Please use it promptly to complete your password reset.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <p>Thank you,<br>Team Pill-Pal</p>`
    );

    return res.json({ message: "Password reset OTP sent" });
  } catch (err) {
    console.error("Forgot Password error:", err.message);
    return res.status(500).json({ error: "Failed to send reset OTP" });
  }
});

/**
 * 6) Reset Password - verify OTP & update password
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, password } = req.body;
    if (!email || !code || !password)
      return res
        .status(400)
        .json({ error: "Email, OTP code, and new password required" });

    const otpDoc = await Otp.findOne({ email: email.toLowerCase(), code: String(code) });
    if (!otpDoc) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    await user.save();

    await Otp.deleteMany({ email: email.toLowerCase() });

    return res.status(201).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password error:", err.message);
    return res.status(500).json({ error: "Failed to reset password" });
  }
});

router.post("/passReset-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });

    const exists = await User.findOne({ email: email });
    if (!exists) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const code = generateOtp();

    // update OTP doc or create new one
    await Otp.findOneAndUpdate(
      { email: email.toLowerCase() },
      { code },
      { upsert: true, new: true }
    );

    await sendMail(
      email,
      "Your verification OTP (Password-Reset)",
      `<p>Dear User,</p>
      <p>Your One-Time Password (OTP) for password reset verification is: <b>${code}</b>.</p>
      <p>This code will expire in <b>${process.env.OTP_TTL_SECONDS || 300}
      </b> seconds. Please use it within this time frame to proceed with resetting your password.</p>
      <p>If you did not request this action, please disregard this email.</p>
      <p>Thank you,<br>Team Pill-Pal</p>`
    );
    
    return res.status(201).json({ message: "OTP sent, Verify the Otp to reset your password" });
  } catch (err) {
    console.error("Password Reset OTP error:", err.message);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
});

module.exports = router;