const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
const authRoute=require("./routes/authRoute");
const adminRoute=require("./routes/adminRoute");
const userRoute=require("./routes/userRoute");
const employeeRoute=require("./routes/employeeRoute");

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));


app.use("/api/auth",authRoute);
app.use("/api/user",userRoute);
app.use("/api/admin",adminRoute);
app.use("/api/employee",employeeRoute);

app.get("/", (req, res) => {
    res.send("Hello World");
});


app.listen(8000, () => {
    console.log("Server running at http://localhost:8000");
});