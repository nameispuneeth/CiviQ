import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  photo: String,
  location: String
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  issues: {
    pending: { type: Map, of: issueSchema, default: {} },
    inprogress: { type: Map, of: issueSchema, default: {} },
    resolved: { type: Map, of: issueSchema, default: {} }
  }
});

export default mongoose.model("User", userSchema);
