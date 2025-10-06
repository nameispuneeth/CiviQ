import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  assignedIssues: [String] // issue IDs
});

export default mongoose.model("Employee", employeeSchema);
