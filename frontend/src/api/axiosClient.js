import axios from "axios";
import { env } from "@/lib/env";

const axiosClient = axios.create({
  baseURL: env.API_URL,
  withCredentials: false,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
