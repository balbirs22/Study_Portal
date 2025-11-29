import Material from "../models/Material.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

export const uploadMaterial = async (req, res) => {
  try {
    const { title, description, subjectId, tags } = req.body;

    if (!subjectId || !req.file) {
      return res.status(400).json({ msg: "subjectId and file are required" });
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer, "materials");

    const material = await Material.create({
      title: title || uploadResult.original_filename,
      description: description || "",
      subject: subjectId,
      fileUrl: uploadResult.secure_url,
      fileType: uploadResult.format,
      uploadedBy: req.user.id,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
    });

    res.status(201).json(material);
  } catch (err) {
    console.error("uploadMaterial error:", err);
    res.status(500).json({ msg: "Error uploading material" });
  }
};

export const uploadMultipleMaterials = async (req, res) => {
  try {
    const { subjectId } = req.body;
    if (!subjectId || !req.files || req.files.length === 0) {
      return res.status(400).json({ msg: "subjectId and files are required" });
    }

    const created = [];

    for (const file of req.files) {
      const uploadResult = await uploadToCloudinary(file.buffer, "materials");

      const material = await Material.create({
        title: file.originalname,
        description: "",
        subject: subjectId,
        fileUrl: uploadResult.secure_url,
        fileType: uploadResult.format,
        uploadedBy: req.user.id,
      });

      created.push(material);
    }

    res.status(201).json(created);
  } catch (err) {
    console.error("uploadMultipleMaterials error:", err);
    res.status(500).json({ msg: "Error uploading multiple materials" });
  }
};

export const getMaterialsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.query;
    if (!subjectId) {
      return res.status(400).json({ msg: "subjectId is required" });
    }

    const materials = await Material.find({
      subject: subjectId,
      isPublic: true,
    })
      .sort({ createdAt: -1 });

    res.json(materials);
  } catch (err) {
    console.error("getMaterialsBySubject error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find()
      .populate("subject", "name code")
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(materials);
  } catch (err) {
    console.error("getAllMaterials error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    await Material.findByIdAndDelete(id);
    res.json({ msg: "Material deleted" });
  } catch (err) {
    console.error("deleteMaterial error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
