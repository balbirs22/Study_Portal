// src/lib/cloudinary.js

export function getCloudinaryPreview(url, width = 300) {
  if (!url) return url;

  // If not a Cloudinary URL, return original
  if (!url.includes("cloudinary.com")) return url;

  // Insert transformation
  return url.replace(
    "/upload/",
    `/upload/w_${width},c_limit/`
  );
}

export function getFilePublicId(url) {
  if (!url.includes("cloudinary.com")) return null;

  const parts = url.split("/upload/");
  const remaining = parts[1]?.split(".");
  return remaining?.[0] || null;
}
