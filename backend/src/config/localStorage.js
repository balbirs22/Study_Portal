import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Save file locally (temporary solution while Cloudinary is down)
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} originalname - Original filename
 * @returns {Object} File info with URL
 */
export const uploadFileLocally = async (fileBuffer, originalname) => {
  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const filename = `${timestamp}-${randomString}-${originalname}`;
  const filepath = path.join(uploadsDir, filename);

  // Write file to disk
  fs.writeFileSync(filepath, fileBuffer);

  // Return file info (URL will be relative to server)
  return {
    secure_url: `/uploads/${filename}`,
    public_id: filename.split(".")[0],
    original_filename: originalname,
  };
};

export default uploadsDir;
