import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: String,
  code: String,         
  branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
  year: { type: mongoose.Schema.Types.ObjectId, ref: "Year" },
  semester: Number,
});

export default mongoose.model("Subject", subjectSchema);
