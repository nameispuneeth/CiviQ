const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

// Models
const User = require("./models/user.model");
const Admin = require("./models/admin.model");
const Issue = require("./models/issue.model"); // We'll create this

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/Hackathon")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));


const UsersecretCode = "UserSecretCode";
const AdminSecretCode = "AdminSecretCode"

// Test route
app.get("/", (req, res) => {
    res.send("Hello World");
});

// ----------------------
// User Registration
// ----------------------
app.post("/api/register", async (req, res) => {
    const { email, name, password } = req.body;

    const tempuser = await User.findOne({ email });
    if (tempuser) return res.send({ status: "error", error: "Email In Use" });

    try {
        await User.create({ name, email, password });
        res.send({ status: "ok" });
    } catch (e) {
        console.error(e);
        res.send({ status: "error", error: "Network Issues" });
    }
});

// ----------------------
// User Login
// ----------------------
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const admin = await Admin.findOne({ email, password });
        if (admin) {
            const token = jwt.sign(
                { name: admin.name, email: admin.email, role: "superadmin" },
                AdminSecretCode
            );
            return res.send({
                status: "ok",
                token,
                role: "superadmin",
                message: "Admin login successful",
            });
        }

        const user = await User.findOne({ email, password });
        if (user) {
            const token = jwt.sign(
                { name: user.name, email: user.email, role: "user" },
                UsersecretCode
            );
            return res.send({
                status: "ok",
                token,
                role: "user",
                message: "User login successful",
            });
        }

        res.status(401).send({ status: "error", error: "Invalid credentials" });

    } catch (e) {
        console.error(e);
        res.send({ status: "error", error: "Network Issues" });
    }
});

// ----------------------
// Submit Issue
// ----------------------
app.post("/api/Generateissue", async (req, res) => {
    console.log("CAME");
    const token = req.headers.authorization; // Bearer token
    if (!token) return res.status(401).send({ ok: false, error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, UsersecretCode);
        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(404).send({ ok: false, error: "User not found" });

        const issueData = req.body; // title, category, description, etc.
        // Create issue in a separate Issue collection
        const issue = await Issue.create({ ...issueData });

        // Store the generated ObjectId in user's pending issues
        user.issues.push(issue._id);
        await user.save();


        // Store only issue ID in user's pending issue
        res.send({ ok: true, status: "ok", id: issue._id, message: "Issue added to pending" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ ok: false, error: "Failed to add issue" });
    }
});

// ----------------------
// Get User Issues (with details)
// ----------------------
app.get("/api/user/issues", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send({ ok: false, error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, UsersecretCode);
        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(404).send({ ok: false, error: "User not found" });

        const Issues = await Issue.find({ _id: { $in: user.issues } });

        res.send({ ok: true, issues: Issues });
    } catch (err) {
        console.error(err);
        res.status(500).send({ ok: false, error: "Failed to fetch issues" });
    }
});

app.get("/api/AdminGetIssues", async (req, res) => {
    console.log("Came");
     const token = req.headers.authorization;
    if (!token) return res.status(401).send({ ok: false, error: "Unauthorized" });
    try{
        const decoded = jwt.verify(token, AdminSecretCode);
        const admin = await Admin.findOne({ email: decoded.email });
        if (!admin) return res.status(404).send({ ok: false, error: "Admin not found" });
        const issues=await Issue.find();
        res.send({status:'ok',Issues:issues});
    }catch(e){
        res.send({status:'error',error:e});
    }
})
// ----------------------
// Start server
// ----------------------
app.listen(8000, () => {
    console.log("Server running at http://localhost:8000");
});
