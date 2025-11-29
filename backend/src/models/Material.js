import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  title: String,
  description: String,
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  fileUrl: String,
  fileType: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isPublic: { type: Boolean, default: true },
  tags: [String],
}, { timestamps: true });

export default mongoose.model("Material", materialSchema);