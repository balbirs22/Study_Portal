import axios from "axios";
import { env } from "@/lib/env";

const axiosClient = axios.create({
  baseURL: env.API_URL,
  withCredentials: false,
  // Render's free service can take close to a minute to wake after inactivity.
  timeout: 65000,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const retryDelays = [2000, 4000, 8000, 12000, 18000];

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const status = error.response?.status;
    const isReadRequest = config?.method?.toLowerCase() === "get";
    const isTemporaryFailure = !error.response || [408, 429, 502, 503, 504].includes(status);
    const retryCount = config?.__retryCount || 0;

    if (!config || !isReadRequest || !isTemporaryFailure || retryCount >= retryDelays.length) {
      return Promise.reject(error);
    }

    config.__retryCount = retryCount + 1;
    await new Promise((resolve) => setTimeout(resolve, retryDelays[retryCount]));
    return axiosClient(config);
  }
);

export default axiosClient;
