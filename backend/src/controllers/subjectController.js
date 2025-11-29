import Subject from "../models/Subject.js";

export const createSubject = async (req, res) => {
  try {
    const { name, code, branchId, yearId, semester } = req.body;

    if (!name || !code || !branchId || !yearId || !semester) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const exists = await Subject.findOne({ code, branch: branchId, year: yearId });
    if (exists) {
      return res
        .status(400)
        .json({ msg: "Subject with this code already exists for this branch/year" });
    }

    const subject = await Subject.create({
      name,
      code,
      branch: branchId,
      year: yearId,
      semester,
    });

    res.status(201).json(subject);
  } catch (err) {
    console.error("createSubject error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const { branchId, yearId, semester } = req.query;

    const filter = {};
    if (branchId) filter.branch = branchId;
    if (yearId) filter.year = yearId;
    if (semester) filter.semester = Number(semester);

    const subjects = await Subject.find(filter)
      .populate("branch", "name code")
      .populate("year", "label order")
      .sort({ name: 1 });

    res.json(subjects);
  } catch (err) {
    console.error("getSubjects error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    await Subject.findByIdAndDelete(id);
    res.json({ msg: "Subject deleted" });
  } catch (err) {
    console.error("deleteSubject error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
