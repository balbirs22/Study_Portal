// src/lib/axios.js
import axios from "axios";
import { env } from "./env";

const api = axios.create({
  baseURL: env.API_URL,
  timeout: 15000,
  withCredentials: false,
});

// Inject admin token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // If token expired
    if (err.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
    }
    return Promise.reject(err);
  }
);

export default api;
