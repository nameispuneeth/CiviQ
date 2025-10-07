const express = require("express");
const app = express();
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/Hackathon");
app.use(cors())

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
        console.log(tempuser);
        const token = jwt.sign({
            name: tempuser.name,
            email: email,
            password: password
        }, secretCode);
        console.log(token)
        res.send({ status: 'ok', token: token });
    } catch (e) {
        res.send({ status: 'error', error: 'Network Issues' });
    }
})


app.listen(8000, () => {
    console.log("Port Is Running At http://localhost:8000")
})