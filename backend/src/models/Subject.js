import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Subject name is required"],
    trim: true,
  },
  code: {
    type: String,
    required: [true, "Subject code is required"],
    trim: true,
    uppercase: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: [true, "Branch is required"],
  },
  year: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Year",
    required: [true, "Year is required"],
  },
  semester: {
    type: Number,
    required: [true, "Semester is required"],
    min: 1,
    max: 8,
  },
  description: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure unique code per branch/year combination
subjectSchema.index({ code: 1, branch: 1, year: 1 }, { unique: true });

export default mongoose.model("Subject", subjectSchema);
