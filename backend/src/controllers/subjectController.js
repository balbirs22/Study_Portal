import Subject from "../models/Subject.js";

export const createSubject = async (req, res) => {
  try {
    const { name, code, branchId, yearId, semester, description } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ msg: "Subject name is required" });
    }
    if (!code || !code.trim()) {
      return res.status(400).json({ msg: "Subject code is required" });
    }
    if (!branchId) {
      return res.status(400).json({ msg: "Branch is required" });
    }
    if (!yearId) {
      return res.status(400).json({ msg: "Year is required" });
    }
    if (semester == null || semester < 1 || semester > 8) {
      return res.status(400).json({ msg: "Semester must be between 1 and 8" });
    }

    // Check if subject with same code already exists for this branch/year
    const exists = await Subject.findOne({
      code: code.trim().toUpperCase(),
      branch: branchId,
      year: yearId,
    });

    if (exists) {
      return res.status(400).json({
        msg: "A subject with this code already exists for this branch and year",
      });
    }

    // Create new subject
    const subject = await Subject.create({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      branch: branchId,
      year: yearId,
      semester: Number(semester),
      description: description || "",
    });

    // Populate references before sending response
    await subject.populate("branch", "name code");
    await subject.populate("year", "label order");

    res.status(201).json({
      msg: "Subject created successfully",
      data: subject,
    });
  } catch (err) {
    console.error("createSubject error:", err);
    if (err.name === "MongoError" && err.code === 11000) {
      return res.status(400).json({
        msg: "A subject with this code already exists for this branch and year",
      });
    }
    res.status(500).json({ msg: "Server error while creating subject" });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const { branchId, yearId, semester } = req.query;

    // Build filter object
    const filter = {};
    if (branchId) filter.branch = branchId;
    if (yearId) filter.year = yearId;
    if (semester) {
      const sem = Number(semester);
      if (sem >= 1 && sem <= 8) {
        filter.semester = sem;
      }
    }

    // Fetch subjects with populated references
    const subjects = await Subject.find(filter)
      .populate("branch", "name code")
      .populate("year", "label order")
      .sort({ semester: 1, name: 1 });

    res.json({
      count: subjects.length,
      data: subjects,
    });
  } catch (err) {
    console.error("getSubjects error:", err);
    res.status(500).json({ msg: "Server error while fetching subjects" });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Subject ID is required" });
    }

    const deletedSubject = await Subject.findByIdAndDelete(id);

    if (!deletedSubject) {
      return res.status(404).json({ msg: "Subject not found" });
    }

    res.json({
      msg: "Subject deleted successfully",
      data: deletedSubject,
    });
  } catch (err) {
    console.error("deleteSubject error:", err);
    res.status(500).json({ msg: "Server error while deleting subject" });
  }
};
