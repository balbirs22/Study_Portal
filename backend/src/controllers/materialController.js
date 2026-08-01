import Material from "../models/Material.js";
import { storeMaterialFile } from "../config/materialStorage.js";
import Subject from "../models/Subject.js";
import path from "path";
import fs from "fs";
import uploadsDir from "../config/localStorage.js";
import { deleteGridFsFile, streamGridFsFile } from "../config/gridFsStorage.js";

export const createExternalMaterial = async (req, res) => {
  try {
    const { title, description, subjectId, externalUrl, resourceType = "link", category = "notes", tags = "" } = req.body;
    if (!title?.trim() || !subjectId || !externalUrl?.trim()) return res.status(400).json({ msg: "Title, subject and URL are required" });
    if (!["video", "drive", "link"].includes(resourceType)) return res.status(400).json({ msg: "Invalid resource type" });
    if (!["notes", "pyq", "assignment", "other"].includes(category)) return res.status(400).json({ msg: "Invalid resource category" });
    try { new URL(externalUrl); } catch { return res.status(400).json({ msg: "Enter a valid URL" }); }
    const subjectExists = await Subject.exists({ _id: subjectId });
    if (!subjectExists) return res.status(404).json({ msg: "Subject not found" });
    const material = await Material.create({ title: title.trim(), description: description?.trim() || "", subject: subjectId, externalUrl: externalUrl.trim(), resourceType, category, uploadedBy: req.user?.id, tags: String(tags).split(",").map((tag) => tag.trim()).filter(Boolean) });
    await material.populate("subject", "name code");
    res.status(201).json({ msg: "Resource link added successfully", data: material });
  } catch (err) { res.status(500).json({ msg: "Error adding resource: " + err.message }); }
};

export const downloadMaterial = async (req, res, next) => {
  try {
    const material = await Material.findOne({ _id: req.params.id, isPublic: true });
    if (!material) return res.status(404).json({ msg: "Material not found" });

    const storedUrl = material.rawUrl || material.fileUrl;
    if (!storedUrl) return res.status(404).json({ msg: "No file is attached to this material" });

    if (/^https?:\/\//i.test(storedUrl)) {
      return res.redirect(storedUrl);
    }

    if (storedUrl.startsWith("gridfs://")) {
      const downloadName = path.basename(material.fileName || material.title || "download");
      res.setHeader("Content-Type", material.fileType || "application/octet-stream");
      res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(downloadName)}`);
      res.setHeader("X-Content-Type-Options", "nosniff");
      return streamGridFsFile(storedUrl.slice("gridfs://".length), res, next);
    }

    const storedName = path.basename(storedUrl);
    const filePath = path.join(uploadsDir, storedName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ msg: "The uploaded file could not be found" });
    }

    const downloadName = path.basename(material.fileName || material.title || storedName);
    res.setHeader("X-Content-Type-Options", "nosniff");
    return res.download(filePath, downloadName, (error) => {
      if (error && !res.headersSent) next(error);
    });
  } catch (error) {
    if (error.name === "CastError") return res.status(400).json({ msg: "Invalid material ID" });
    next(error);
  }
};

/**
 * Upload a single material
 */
export const uploadMaterial = async (req, res) => {
  try {
    const { title, description, subjectId, category = "notes", tags } = req.body;

    // Validation
    if (!subjectId || !subjectId.trim()) {
      return res.status(400).json({ msg: "Subject ID is required" });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "File is required" });
    }

    const { buffer, mimetype, originalname, size } = req.file;

    // Use local storage only (Cloudinary disabled for now)
    let uploadResult;
    try {
      console.log(`Uploading ${originalname} to local storage...`);
      uploadResult = await storeMaterialFile(buffer, { originalname, mimetype });
      console.log("✅ Local storage upload successful");
    } catch (localError) {
      console.error("❌ Local storage upload failed:", localError);
      return res.status(500).json({ msg: "Failed to upload file: " + localError.message });
    }

    if (!uploadResult || !uploadResult.secure_url) {
      return res.status(500).json({ msg: "Failed to save file" });
    }

    // Create material record
    const material = await Material.create({
      title: title?.trim() || originalname || "Untitled",
      description: description?.trim() || "",
      subject: subjectId,
      fileUrl: uploadResult.viewUrl || uploadResult.secure_url,
      rawUrl: uploadResult.secure_url,
      fileType: mimetype, // Store original MIME type for proper downloads
      fileName: originalname, // Store original filename
      fileSize: size,
      uploadedBy: req.user?.id,
      tags: tags
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      resourceType: "file",
      category,
    });

    await material.populate("subject", "name code");
    await material.populate("uploadedBy", "name email");

    res.status(201).json({
      msg: "Material uploaded successfully",
      data: material,
    });
  } catch (err) {
    console.error("uploadMaterial error:", err);
    res.status(500).json({ msg: "Error uploading material: " + err.message });
  }
};

/**
 * Upload multiple materials
 */
export const uploadMultipleMaterials = async (req, res) => {
  try {
    const { subjectId, category = "notes" } = req.body;

    // Validation
    if (!subjectId || !subjectId.trim()) {
      return res.status(400).json({ msg: "Subject ID is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: "At least one file is required" });
    }

    const created = [];
    const errors = [];

    // Upload each file
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];

      try {
        const { buffer, mimetype, originalname, size } = file;

        // Use local storage only (Cloudinary disabled for now)
        console.log(`Uploading ${originalname} to local storage...`);
        let uploadResult = await storeMaterialFile(buffer, { originalname, mimetype });
        console.log(`✅ ${originalname} uploaded successfully`);

        if (!uploadResult || !uploadResult.secure_url) {
          errors.push(`Failed to upload ${originalname}`);
          continue;
        }

        const material = await Material.create({
          title: originalname,
          description: "",
          subject: subjectId,
          fileUrl: uploadResult.viewUrl || uploadResult.secure_url, // For viewing
          rawUrl: uploadResult.secure_url, // For downloading (actual file)
          fileType: mimetype, // Store original MIME type
          fileName: originalname, // Store original filename
          fileSize: size,
          uploadedBy: req.user?.id,
          resourceType: "file",
          category,
        });

        await material.populate("subject", "name code");
        await material.populate("uploadedBy", "name email");

        created.push(material);
      } catch (err) {
        console.error(`Error uploading file ${file.originalname}:`, err);
        errors.push(`Error with file ${file.originalname}: ${err.message}`);
      }
    }

    const statusCode =
      errors.length > 0 && created.length === 0 ? 400 : 201;

    res.status(statusCode).json({
      msg: `Uploaded ${created.length} file(s) successfully`,
      data: created,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("uploadMultipleMaterials error:", err);
    res.status(500).json({ msg: "Error uploading materials: " + err.message });
  }
};

/**
 * Get materials for a subject (public)
 */
export const getMaterialsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.query;

    if (!subjectId || !subjectId.trim()) {
      return res.status(400).json({ msg: "Subject ID is required" });
    }

    const materials = await Material.find({
      subject: subjectId,
      isPublic: true,
    })
      .populate("subject", "name code")
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: materials.length,
      data: materials,
    });
  } catch (err) {
    console.error("getMaterialsBySubject error:", err);
    res.status(500).json({ msg: "Error fetching materials: " + err.message });
  }
};

/**
 * Get all materials (admin)
 */
export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find()
      .populate("subject", "name code")
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: materials.length,
      data: materials,
    });
  } catch (err) {
    console.error("getAllMaterials error:", err);
    res.status(500).json({ msg: "Error fetching materials: " + err.message });
  }
};

/**
 * Delete a material (admin)
 */
export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Material ID is required" });
    }

    const material = await Material.findByIdAndDelete(id);

    if (!material) {
      return res.status(404).json({ msg: "Material not found" });
    }

    try {
      await deleteGridFsFile(material.rawUrl || material.fileUrl);
    } catch (storageError) {
      console.error("Failed to remove stored file:", storageError.message);
    }

    res.json({
      msg: "Material deleted successfully",
      data: material,
    });
  } catch (err) {
    console.error("deleteMaterial error:", err);
    res.status(500).json({ msg: "Error deleting material: " + err.message });
  }
};
