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


const secretCode = "Heelo";

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
    const { email, password } = req.body;

    try {
        const tempuser = await User.findOne({ email, password });
        if (!tempuser) return res.send({ status: "error", error: "Invalid credentials" });

        const token = jwt.sign(
            { name: tempuser.name, email: tempuser.email },
            secretCode
        );
        res.send({ status: "ok", token });
    } catch (e) {
        console.error(e);
        res.send({ status: "error", error: "Network Issues" });
    }
});

// ----------------------
// Submit Issue
// ----------------------
app.post("/api/issues", async (req, res) => {
    console.log("CAME");
    const token = req.headers.authorization; // Bearer token
    if (!token) return res.status(401).send({ ok: false, error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, secretCode);
        console.log(decoded);
        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(404).send({ ok: false, error: "User not found" });

        const issueData = req.body; // title, category, description, etc.
        // Create issue in a separate Issue collection
        const issue = await Issue.create({ ...issueData });

        // Store the generated ObjectId in user's pending issues
        user.issues.pending.push(issue._id);
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
        const decoded = jwt.verify(token, secretCode);
        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(404).send({ ok: false, error: "User not found" });

        // Convert Map IDs to array
        // user.issues.pending is already an array of ObjectIds
        const pendingIssues = await Issue.find({ _id: { $in: user.issues.pending } });
        const inprogressIssues=await Issue.find({ _id: { $in: user.issues.inprogress } });
        const resolvedssues=await Issue.find({ _id: { $in: user.issues.resolved } });

        res.send({ ok: true, pending: pendingIssues,inprogress:inprogressIssues,resolved:resolvedssues });
    } catch (err) {
        console.error(err);
        res.status(500).send({ ok: false, error: "Failed to fetch issues" });
    }
});

// ----------------------
// Start server
// ----------------------
app.listen(8000, () => {
    console.log("Server running at http://localhost:8000");
});
