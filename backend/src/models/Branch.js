import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  name: String,       
  code: String,       
});

export default mongoose.model("Branch", branchSchema);
