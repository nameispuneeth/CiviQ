const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  // Store Issue IDs in arrays
  issues: {
    pending: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }],
    inprogress: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }],
    resolved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }],
  }
});

module.exports = mongoose.model("User", userSchema);
