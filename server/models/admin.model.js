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
      ]
    },
  ],
});

module.exports = mongoose.model("Admin", adminSchema);
