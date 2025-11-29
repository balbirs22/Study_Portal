import axiosClient from "./axiosClient";

// Public
export const getMaterials = (subjectId) =>
  axiosClient.get("/public/materials", { params: { subjectId } });

// Admin single upload
export const uploadMaterial = (data) =>
  axiosClient.post("/admin/materials", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Admin multiple uploads
export const uploadMultipleMaterials = (data) =>
  axiosClient.post("/admin/materials/multiple", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Delete material
export const deleteMaterial = (id) =>
  axiosClient.delete(`/admin/materials/${id}`);
