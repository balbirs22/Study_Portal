import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});
const sendOtpMail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: "Admin Registration OTP - Study Portal",
    text: `Your OTP for admin registration is ${otp}. It is valid for 10 minutes.`,
  };
  await transporter.sendMail(mailOptions);
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const registerAdminSendOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ msg: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing && existing.isVerified && existing.role === "admin") {
      return res.status(400).json({ msg: "Admin with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 

    let user;

    if (existing) {
      existing.name = name;
      existing.passwordHash = passwordHash;
      existing.role = "admin";
      existing.isVerified = false;
      existing.otp = otp;
      existing.otpExpiresAt = otpExpiresAt;
      user = await existing.save();
    } else {
      user = await User.create({
        name,
        email,
        passwordHash,
        role: "admin",
        isVerified: false,
        otp,
        otpExpiresAt,
      });
    }

    await sendOtpMail(email, otp);

    res.status(200).json({
      msg: "OTP sent to email. Please verify to complete registration.",
      email: user.email,
    });
  } catch (err) {
    console.error("registerAdminSendOtp error:", err);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
};
export const verifyAdminOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ msg: "Email and OTP are required" });
    }

    const user = await User.findOne({ email, role: "admin" });
    if (!user) {
      return res.status(400).json({ msg: "Admin not found for this email" });
    }

    if (!user.otp || !user.otpExpiresAt) {
      return res.status(400).json({ msg: "No OTP generated. Please register again." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ msg: "OTP expired. Please register again." });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Admin verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("verifyAdminOtp error:", err);
    res.status(500).json({ msg: "Error verifying OTP" });
  }
};
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email, role: "admin" });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ msg: "Email not verified. Complete OTP verification." });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Logged in",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("loginAdmin error:", err);
    res.status(500).json({ msg: "Error logging in" });
  }
};
