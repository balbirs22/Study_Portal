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
export function downloadFile(url, fileName) {
  if (!url) {
    console.error("No URL provided for download");
    return;
  }

  // Convert relative URLs to absolute (for local storage files)
  let fullUrl = url;
  if (url.startsWith("/")) {
    // Use the backend server URL (http://localhost:5000)
    fullUrl = "http://localhost:5000" + url;
  }

  console.log("Downloading from:", fullUrl);

  // For local storage files, directly open/download
  if (url.startsWith("/uploads/")) {
    // Direct download for local files
    const link = document.createElement("a");
    link.href = fullUrl;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // For other URLs, open in new tab (Cloudinary, etc)
    window.open(fullUrl, "_blank");
  }
}
