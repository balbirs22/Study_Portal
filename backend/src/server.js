import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION ❌ Shutting down...");
  console.error(err);
  process.exit(1);
});

let server;

async function startServer() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

startServer();

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION ❌ Shutting down...");
  console.error(err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  console.log("👋 SIGINT received. Shutting down gracefully...");
  if (server) {
    server.close();
  }
  await mongoose.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...");
  if (server) {
    server.close();
  }
  await mongoose.disconnect();
  process.exit(0);
});
