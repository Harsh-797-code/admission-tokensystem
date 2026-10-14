import studentRoutes from "./routes/student.routes.js";
import slotRoutes from "./routes/slot.routes.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import db from "./db.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/slots", slotRoutes);
app.use("/api/students", studentRoutes);

// Health Check & Database Test Route
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");

    res.status(200).json({
      status: "success",
      message: "Admission Token API is online & connected to DB",
      db_time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Start Server
const PORT = process.env.PORT || 7777;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});