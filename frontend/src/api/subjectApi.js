import axiosClient from "./axiosClient";

// Public
export const getSubjects = (params) =>
  axiosClient.get("/public/subjects", { params });

// Admin
export const createSubject = (data) => axiosClient.post("/admin/subjects", data);
export const updateSubject = (id, data) => axiosClient.put(`/admin/subjects/${id}`, data);
export const deleteSubject = (id) => axiosClient.delete(`/admin/subjects/${id}`);
