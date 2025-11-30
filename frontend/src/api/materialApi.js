import axiosClient from "./axiosClient";

// Public - get materials for a subject
export const getMaterials = (subjectId) =>
  axiosClient.get("/public/materials", { params: { subjectId } });

// Admin - single file upload
export const uploadMaterial = (data) =>
  axiosClient.post("/admin/materials", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Admin - multiple files upload
export const uploadMultipleMaterials = (data) =>
  axiosClient.post("/admin/materials/multiple", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Admin - get all materials (for management)
export const getAllMaterials = () =>
  axiosClient.get("/admin/materials");

// Admin - delete material
export const deleteMaterial = (id) =>
  axiosClient.delete(`/admin/materials/${id}`);
