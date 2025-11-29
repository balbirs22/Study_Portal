import mongoose from "mongoose";

const yearSchema = new mongoose.Schema({
  label: String,   
  order: Number,   
});

export default mongoose.model("Year", yearSchema);
