import alertRoutes from './routes/alertRoutes.js';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import flightRoutes from "./routes/flightRoutes.js";
import passengerRoutes from "./routes/passengerRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── API Routes ────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/passengers", passengerRoutes);
app.use('/api/alerts', alertRoutes);

// ─── Health Check ──────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Global Error Handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// ─── Start Server ──────────────────────────────────────────
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n🚀 AeroNotify server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints:`);
    console.log(`   POST   /api/auth/login`);
    console.log(`   GET    /api/flights`);
    console.log(`   POST   /api/flights          (protected)`);
    console.log(`   PUT    /api/flights/:id       (protected)`);
    console.log(`   DELETE /api/flights/:id       (protected)`);
    console.log(`   POST   /api/passengers/register`);
    console.log(`   GET    /api/passengers/:flightNumber (protected)\n`);
  });
};

startServer();
