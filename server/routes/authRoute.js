const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Models
const User = require("../models/user.model");
const Admin = require("../models/admin.model");
const Employee = require("../models/employee.model");

const UsersecretCode =process.env.UserScrtCode;
const AdminSecretCode = process.env.AdminScrtCode

router.post("/register", async (req, res) => {
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
router.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
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

router.post("/login/admin", async (req, res) => {
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
        const employee = await Employee.findOne({ email, password });
        if (employee) {
            const token = jwt.sign(
                { name: employee.name, email: employee.email, role: "employee" },
                AdminSecretCode
            );
            return res.send({
                status: "ok",
                token,
                role: "employee",
                message: "Employee login successful",
            });
        }

        res.status(401).send({ status: "error", error: "Invalid credentials" });

    } catch (e) {
        console.error(e);
        res.send({ status: "error", error: "Network Issues" });
    }
});


module.exports=router;