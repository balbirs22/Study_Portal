import mongoose from "mongoose";

const yearSchema = new mongoose.Schema({
  label: {
    type: String,
    required: [true, "Year label is required"],
    trim: true,
    unique: true,
  },
  order: {
    type: Number,
    required: [true, "Order is required"],
    unique: true,
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

export default mongoose.model("Year", yearSchema);
