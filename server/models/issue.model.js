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

  assigned_department: { type: String, default: null },
  assigned_department_employee: { type: String, default: null },
  assigned_department_number: { type: String, default: null },
  assigned_date: { type: Date, default: null },
  rating: { type: mongoose.Schema.Types.Decimal128, default: null },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Issue", issueSchema);
