import axiosClient from "./axiosClient";

// Step 1: send OTP
export const sendOtp = (data) => axiosClient.post("/auth/register/send-otp", data);

// Step 2: verify OTP
export const verifyOtp = (data) => axiosClient.post("/auth/register/verify-otp", data);

// Admin login
export const loginAdmin = (data) => axiosClient.post("/auth/login", data);
