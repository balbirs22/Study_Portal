import Branch from "../models/Branch.js";

export const createBranch = async (req, res) => {
  try {
    const { name, code, description } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ msg: "Branch name is required" });
    }
    if (!code || !code.trim()) {
      return res.status(400).json({ msg: "Branch code is required" });
    }

    // Check if code already exists
    const codeExists = await Branch.findOne({
      code: code.trim().toUpperCase(),
    });
    if (codeExists) {
      return res.status(400).json({ msg: "A branch with this code already exists" });
    }

    // Check if name already exists
    const nameExists = await Branch.findOne({ name: name.trim() });
    if (nameExists) {
      return res.status(400).json({ msg: "A branch with this name already exists" });
    }

    // Create branch
    const branch = await Branch.create({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description?.trim() || "",
    });

    res.status(201).json({
      msg: "Branch created successfully",
      data: branch,
    });
  } catch (err) {
    console.error("createBranch error:", err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        msg: `A branch with this ${field} already exists`,
      });
    }
    res.status(500).json({ msg: "Server error while creating branch" });
  }
};

export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ name: 1 });

    res.json({
      count: branches.length,
      data: branches,
    });
  } catch (err) {
    console.error("getBranches error:", err);
    res.status(500).json({ msg: "Server error while fetching branches" });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Branch ID is required" });
    }

    const branch = await Branch.findByIdAndDelete(id);

    if (!branch) {
      return res.status(404).json({ msg: "Branch not found" });
    }

    res.json({
      msg: "Branch deleted successfully",
      data: branch,
    });
  } catch (err) {
    console.error("deleteBranch error:", err);
    res.status(500).json({ msg: "Server error while deleting branch" });
  }
};
