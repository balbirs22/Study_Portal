// src/lib/file.js

export const allowedExtensions = [
  "pdf",
  "ppt",
  "pptx",
  "doc",
  "docx",
  "jpg",
  "jpeg",
  "png",
];

export function getExtension(fileName) {
  return fileName?.split(".").pop().toLowerCase();
}

export function isValidFileType(file) {
  const ext = getExtension(file.name);
  return allowedExtensions.includes(ext);
}

export function validateFiles(files) {
  const invalid = [];
  for (const f of files) {
    if (!isValidFileType(f)) invalid.push(f.name);
  }
  return invalid;
}

export function openFile(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}
