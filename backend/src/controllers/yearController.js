import Year from "../models/Year.js";

export const createYear = async (req, res) => {
  try {
    const { label, order, description } = req.body;

    // Validation
    if (!label || !label.trim()) {
      return res.status(400).json({ msg: "Year label is required" });
    }
    if (order == null || order < 1 || order > 8) {
      return res.status(400).json({ msg: "Order must be between 1 and 8" });
    }

    // Check if label already exists
    const labelExists = await Year.findOne({ label: label.trim() });
    if (labelExists) {
      return res.status(400).json({ msg: "A year with this label already exists" });
    }

    // Check if order already exists
    const orderExists = await Year.findOne({ order: Number(order) });
    if (orderExists) {
      return res.status(400).json({ msg: "A year with this order already exists" });
    }

    // Create year
    const year = await Year.create({
      label: label.trim(),
      order: Number(order),
      description: description?.trim() || "",
    });

    res.status(201).json({
      msg: "Year created successfully",
      data: year,
    });
  } catch (err) {
    console.error("createYear error:", err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        msg: `A year with this ${field} already exists`,
      });
    }
    res.status(500).json({ msg: "Server error while creating year" });
  }
};

export const getYears = async (req, res) => {
  try {
    const years = await Year.find().sort({ order: 1 });

    res.json({
      count: years.length,
      data: years,
    });
  } catch (err) {
    console.error("getYears error:", err);
    res.status(500).json({ msg: "Server error while fetching years" });
  }
};

export const deleteYear = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Year ID is required" });
    }

    const year = await Year.findByIdAndDelete(id);

    if (!year) {
      return res.status(404).json({ msg: "Year not found" });
    }

    res.json({
      msg: "Year deleted successfully",
      data: year,
    });
  } catch (err) {
    console.error("deleteYear error:", err);
    res.status(500).json({ msg: "Server error while deleting year" });
  }
};
