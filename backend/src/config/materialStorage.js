import { uploadFileLocally } from "./localStorage.js";
import { uploadToGridFs } from "./gridFsStorage.js";

export const storeMaterialFile = (buffer, file) => {
  if (process.env.STORAGE_DRIVER === "gridfs") {
    return uploadToGridFs(buffer, file);
  }
  return uploadFileLocally(buffer, file.originalname);
};
