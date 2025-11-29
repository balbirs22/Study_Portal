import Branch from "../models/Branch.js";

export const createBranch = async (req, res) => {
  try {
    const { name, code } = req.body;
    if (!name || !code) {
      return res.status(400).json({ msg: "Name and code are required" });
    }

    const exists = await Branch.findOne({ code });
    if (exists) {
      return res.status(400).json({ msg: "Branch with this code already exists" });
    }

    const branch = await Branch.create({ name, code });
    res.status(201).json(branch);
  } catch (err) {
    console.error("createBranch error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ name: 1 });
    res.json(branches);
  } catch (err) {
    console.error("getBranches error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    await Branch.findByIdAndDelete(id);
    res.json({ msg: "Branch deleted" });
  } catch (err) {
    console.error("deleteBranch error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
