const express = require("express");
const cors = require("cors");

const app = express();

// --- CORS (strict allowlist from env) ---
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (like Postman) or in allowlist
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// --- Body parsing ---
app.use(express.json({ limit: "10kb" }));


// --- Health check ---
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "medicine-alternatives-api" });
});

// --- Placeholder for future routes (auth, search, save, etc.) ---
app.use("/api/auth", require("./routes/auth.routes"));
const searchRoutes = require("./routes/search.routes");
app.use("/api/search", searchRoutes);
// app.use("/api/medicines", require("./routes/medicines.routes"));

const saveAftLogin = require("./routes/savedAftLogin.routes")
app.use("/api/saved", saveAftLogin);

// const savesRoutes = require("./routes/saves.routes");
// app.use("/api/saves", savesRoutes);

// --- 404 handler ---
app.use((req, res, _next) => {
  res.status(404).json({ error: "Route not found" });
});

// --- Error handler ---
app.use((err, _req, res, _next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
