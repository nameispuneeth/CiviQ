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

  duplicate_of: { type: mongoose.Schema.Types.ObjectId, ref: "Issue", default: null },
  report_count: { type: Number, default: 1 },

  assigned_department: { type: String, default: null },
  assigned_department_employee: { type: String, default: null },
  assigned_date: { type: Date, default: null },
  assigned_employee_finished:{type:Boolean},
  resolved_date: { type: Date, default: null },
  rating: { type: Number, default: null },
   user_feedback:{type:String,default:null},
  createdAt: { type: Date, default: Date.now },
});

// Reuse the compiled model if it already exists — prevents OverwriteModelError
// when the module is loaded more than once (tests, watch mode, serverless).
module.exports = mongoose.models.Issue || mongoose.model("Issue", issueSchema);
