import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { authMiddleware } from "./middleware/auth";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import hydrationRoutes from "./routes/hydration";
import sleepRoutes from "./routes/sleep";
import mealsRoutes from "./routes/meals";
import habitsRoutes from "./routes/habits";
import habitLogsRoutes from "./routes/habitLogs";
import memoriesRoutes from "./routes/memories";
import healthRoutes from "./routes/health";

const app = express();
const PORT = parseInt(process.env.PORT || "4000", 10);

app.use(cors());
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api/profile", authMiddleware, profileRoutes);
app.use("/api/hydration", authMiddleware, hydrationRoutes);
app.use("/api/sleep", authMiddleware, sleepRoutes);
app.use("/api/meals", authMiddleware, mealsRoutes);
app.use("/api/habits", authMiddleware, habitsRoutes);
app.use("/api/habit-logs", authMiddleware, habitLogsRoutes);
app.use("/api/memories", authMiddleware, memoriesRoutes);
app.use("/api/health", authMiddleware, healthRoutes);

app.get("/api/healthz", (_req, res) => res.json({ status: "ok" }));

async function start() {
  await connectDB();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lumina backend running on port ${PORT}`);
  });
}

start();
