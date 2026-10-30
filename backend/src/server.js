require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const storeRoutes = require("./routes/store");
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");
const enquiryRoutes = require("./routes/enquiries");

const app = express();

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((url) => url.trim().replace(/\/$/, ""))
    .filter(Boolean),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HyperStore API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "HyperStore API",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "not_connected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/enquiries", enquiryRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

app.use((error, req, res, next) => {
  if (error?.name === "ValidationError" || error?.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid request data" });
  }
  if (error?.code === 11000) return res.status(409).json({ success: false, message: "That value is already in use" });
  console.error("Request failed:", error.message);
  return res.status(500).json({ success: false, message: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error("JWT_SECRET must be set to a value of at least 32 characters.");
    }
    await connectDB();

    app.listen(PORT, () => {
      console.log(`HyperStore API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("HyperStore startup failed. Check your database settings.");
    process.exit(1);
  }
}

startServer();
