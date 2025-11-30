import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper to decide resource_type based on MIME type
function getResourceType(mimetype) {
  // Images should be stored as "image" resource type
  if (mimetype?.startsWith("image/")) return "image";
  
  // Videos should be stored as "video" resource type
  if (mimetype?.startsWith("video/")) return "video";
  
  // PDFs can be "raw" but we'll handle specially in upload
  if (mimetype === "application/pdf") return "raw";
  
  // Everything else should be "raw"
  return "raw";
}

/**
 * Upload buffer to Cloudinary with correct resource_type
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {Object} options - Upload options
 * @param {string} options.folder - Folder in Cloudinary
 * @param {string} options.mimetype - MIME type of file
 * @param {string} options.originalname - Original filename
 * @returns {Promise} Cloudinary upload result
 */
export const uploadToCloudinary = async (
  fileBuffer,
  { folder = "materials", mimetype, originalname } = {}
) => {
  const resource_type = getResourceType(mimetype);
  const fileExtension = originalname.split(".").pop().toLowerCase();
  const publicId = originalname.split(".")[0];

  return await new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type,
      public_id: publicId,
    };

    // For PDFs, specify format to ensure proper handling
    if (mimetype === "application/pdf" || fileExtension === "pdf") {
      uploadOptions.format = "pdf";
    }

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return reject(error);
        }

        // For PDFs, use secure_url directly (it's already a proper PDF URL)
        // For raw files, also use secure_url
        const downloadUrl = result.secure_url;
        
        // For viewing PDFs in browser, add inline display
        let viewUrl = downloadUrl;
        if (mimetype === "application/pdf" || fileExtension === "pdf") {
          // Add /fl_attachment:false to display inline instead of download
          viewUrl = downloadUrl.replace("/upload/", "/upload/fl_attachment:false/");
        }

        resolve({
          ...result,
          secure_url: downloadUrl,  // Use this for downloading the actual file
          viewUrl,                   // Use this for viewing in browser
        });
      }
    );

    // Handle stream errors
    stream.on("error", (error) => {
      console.error("Stream error:", error);
      reject(error);
    });

    stream.end(fileBuffer);
  });
};
