import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;
const name = process.env.SEED_ADMIN_NAME || "StudyBase Admin";

if (!process.env.MONGO_URI || !email || !password) {
  console.error("MONGO_URI, SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required.");
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGO_URI);
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.findOneAndUpdate(
    { email: email.trim().toLowerCase() },
    {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: "admin",
      isVerified: true,
      $unset: { otp: 1, otpExpiresAt: 1 },
    },
    { new: true, upsert: true, runValidators: true }
  );
  console.log(`Verified admin ready: ${user.email}`);
} catch (error) {
  console.error("Failed to seed admin:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
