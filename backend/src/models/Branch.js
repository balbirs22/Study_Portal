import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Branch name is required"],
    trim: true,
    unique: true,
  },
  code: {
    type: String,
    required: [true, "Branch code is required"],
    trim: true,
    uppercase: true,
    unique: true,
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

export default mongoose.model("Branch", branchSchema);
