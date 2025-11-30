import Material from "../models/Material.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { uploadFileLocally } from "../config/localStorage.js";

/**
 * Upload a single material
 */
export const uploadMaterial = async (req, res) => {
  try {
    const { title, description, subjectId, tags } = req.body;

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
      uploadResult = await uploadFileLocally(buffer, originalname);
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
    const { subjectId } = req.body;

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
        let uploadResult = await uploadFileLocally(buffer, originalname);
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

    res.json({
      msg: "Material deleted successfully",
      data: material,
    });
  } catch (err) {
    console.error("deleteMaterial error:", err);
    res.status(500).json({ msg: "Error deleting material: " + err.message });
  }
};
