const express = require("express");
const app = express();
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const mongoose = require("mongoose");
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/Hackathon");
app.use(cors())
const secretCode="Heelo";
app.get("/", (req, res) => {
    res.send("Hello World");
})
app.post("/api/register", async (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;


    const tempuser = await User.findOne({ email: email });

    if (tempuser) {
        res.send({ status: "error", error: "Email In Use" });
        return;
    }

    try {
        const response = User.create({
            name: name,
            password: password,
            email: email
        });
        res.send({ status: 'ok' })
    } catch (e) {
        res.send({ status: "error", error: "Network Issues" })
    }
})
app.post("/api/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const tempuser = await User.findOne({ email: email, password: password });
        console.log(tempuser)
        const token = jwt.sign({
            name: tempuser.name,
            email: email,
            password: password
        }, secretCode);
        res.send({ status: 'ok', token: token });
    } catch (e) {
        res.send({ status: 'error', error: 'Network Issues' });
    }
})

app.post("/api/issues", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).send({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).send({ error: "User not found" });

    const issueData = req.body; // title, category, description, photo, location
    const issueId = Date.now().toString(); // unique id for the Map

    user.issues.pending.set(issueId, issueData);
    await user.save();

    res.send({ status: "ok", issueId, message: "Issue added to pending" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to add issue" });
  }
});


app.listen(8000, () => {
    console.log("Port Is Running At http://localhost:8000")
})