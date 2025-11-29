import express from "express";
import {
  loginAdmin,
  registerAdminSendOtp,
  verifyAdminOtp,
} from "../controllers/authController.js";

const router = express.Router();
router.post("/register/send-otp", registerAdminSendOtp);
router.post("/register/verify-otp", verifyAdminOtp);
router.post("/login", loginAdmin);
export default router;
