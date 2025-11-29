import Year from "../models/Year.js";

export const createYear = async (req, res) => {
  try {
    const { label, order } = req.body;
    if (!label || order == null) {
      return res.status(400).json({ msg: "Label and order are required" });
    }

    const year = await Year.create({ label, order });
    res.status(201).json(year);
  } catch (err) {
    console.error("createYear error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getYears = async (req, res) => {
  try {
    const years = await Year.find().sort({ order: 1 });
    res.json(years);
  } catch (err) {
    console.error("getYears error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteYear = async (req, res) => {
  try {
    const { id } = req.params;
    await Year.findByIdAndDelete(id);
    res.json({ msg: "Year deleted" });
  } catch (err) {
    console.error("deleteYear error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
