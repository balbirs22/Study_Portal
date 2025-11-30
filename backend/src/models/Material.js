import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  title: String,
  description: String,
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  fileUrl: String, // Viewing URL (viewer-friendly for PDFs)
  rawUrl: String, // Raw download URL (actual file content)
  fileType: String, // MIME type (e.g., "application/pdf")
  fileName: String, // Original filename for downloads
  fileSize: Number, // File size in bytes
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isPublic: { type: Boolean, default: true },
  tags: [String],
}, { timestamps: true });

export default mongoose.model("Material", materialSchema);