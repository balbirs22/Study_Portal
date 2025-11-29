import axiosClient from "./axiosClient";

// Public
export const getAllYears = () => axiosClient.get("/public/years");

// Admin
export const createYear = (data) => axiosClient.post("/admin/years", data);
export const updateYear = (id, data) => axiosClient.put(`/admin/years/${id}`, data);
export const deleteYear = (id) => axiosClient.delete(`/admin/years/${id}`);
