const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/auth.js");
const listingRoutes = require("./routes/listing.js");
const bookingRoutes = require("./routes/booking.js");
const userRoutes = require("./routes/user.js");

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("public"));

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/properties", listingRoutes);
app.use("/bookings", bookingRoutes);
app.use("/users", userRoutes);

app.get("/health", async (_req, res) => {
  const databaseState = mongoose.connection.readyState;
  const databaseStatus =
    databaseState === 1 ? "connected" : "disconnected";

  res.status(databaseState === 1 ? 200 : 503).json({
    status: databaseState === 1 ? "ok" : "error",
    database: databaseStatus,
  });
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 3001;
const DB_NAME = process.env.MONGO_DB_NAME || "rentease_admin";

if (!process.env.MONGO_URL) {
  console.error("MONGO_URL is not set. Add it to server/.env or Render environment variables.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URL, {
    dbName: DB_NAME,
  })
  .then(() => {
    console.log(`MongoDB connected: ${DB_NAME}`);
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    console.error("Check MONGO_URL, database user password, and Atlas Network Access (0.0.0.0/0).");
    process.exit(1);
  });
