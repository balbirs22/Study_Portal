// src/lib/env.js

const defaultApiUrl = import.meta.env.PROD
  ? "https://studybase-api-7fx1.onrender.com/api"
  : "http://localhost:5000/api";

export const env = {
  API_URL: import.meta.env.VITE_API_URL || defaultApiUrl,
  CLOUDINARY_BASE: import.meta.env.VITE_CLOUDINARY_BASE || "",
};
