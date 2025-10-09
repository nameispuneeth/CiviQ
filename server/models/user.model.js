const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  photo: String,
  address: String,
  latitude:String,
  longitude:String,
  reporter_name:String,
  reporter_email:String,
  is_anonymous:Boolean
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  issues: {
    pending: { type: Map, of: issueSchema, default: {} },
    inprogress: { type: Map, of: issueSchema, default: {} },
    resolved: { type: Map, of: issueSchema, default: {} },
  },
});

module.exports = mongoose.model("User", userSchema);
