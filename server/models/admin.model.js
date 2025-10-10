const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "admin" },

  // Departments managed by admin
  departments: [
    {
      name: String,
      description: String,
      employees: [
        {
          name: String,
          email: String,
          phone: String,
        },
      ],
      // Track issues by status using IDs
       issues: {
    pending: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }],
    inprogress: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }],
    resolved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }],
  }
    },
  ],
});

module.exports = mongoose.model("Admin", adminSchema);
