const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  photo: String,
  address: String,
  latitude: String,
  longitude: String,
  reporter_name: String,
  reporter_email: String,
  is_anonymous: Boolean,
  status: { type: String, enum: ["pending", "inprogress", "resolved"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Issue", issueSchema);
