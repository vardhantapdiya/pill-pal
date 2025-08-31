const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("❌ DATABASE_URL is missing in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{console.log("✅ MongoDB connected")})
    .catch((error)=>{console.log("Error in connecting to db")});

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    // Graceful shutdown for production
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🛑 MongoDB connection closed due to app termination");
      process.exit(0);
    });

  } catch (error) {
    console.error("❌ Error in DB connection:", error.message);
    process.exit(1);
  }
};

module.exports = dbConnect;
