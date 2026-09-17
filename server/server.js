const dns = require("dns");

// Fix MongoDB SRV DNS resolution
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const sosRoutes = require("./routes/sosRoutes");
const app = express();

const PORT = process.env.PORT || 5000;


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "SafeRoute backend is running successfully 🚀",
  });
});


// ===============================
// AUTH ROUTES
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/sos", sosRoutes);


// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(
        `🚀 SafeRoute Server running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
  });