import axiosClient from "./axiosClient";

// Public — no login required
export const getAllBranches = () => axiosClient.get("/public/branches");

// Admin — requires JWT
export const createBranch = (data) => axiosClient.post("/admin/branches", data);
export const deleteBranch = (id) => axiosClient.delete(`/admin/branches/${id}`);
export const updateBranch = (id, data) => axiosClient.put(`/admin/branches/${id}`, data);
