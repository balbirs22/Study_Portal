import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: { type: String, enum: ["admin"], default: "admin" },
    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpiresAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
