// src/lib/cloudinary.js

export function getCloudinaryPreview(url, width = 300) {
  if (!url) return url;

  // If not a Cloudinary URL, return original
  if (!url.includes("cloudinary.com")) return url;

  // For images, insert transformation for preview
  // For raw files, return URL as-is (Cloudinary will serve the file properly)
  if (url.includes("/image/")) {
    return url.replace(
      "/upload/",
      `/upload/w_${width},c_limit/`
    );
  }

  // Raw files don't need transformation
  return url;
}

export function getFilePublicId(url) {
  if (!url.includes("cloudinary.com")) return null;

  const parts = url.split("/upload/");
  const remaining = parts[1]?.split(".");
  return remaining?.[0] || null;
}

/**
 * Download file with proper filename from Cloudinary URL or local storage
 * @param {string} url - File URL (can be relative or absolute)
 * @param {string} fileName - Original filename for download
 */
export function downloadFile(url) {
  if (!url) return;
  const link = document.createElement("a");
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
