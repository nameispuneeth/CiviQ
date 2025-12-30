const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config();

const Admin = require("../models/admin.model");
const Issue = require("../models/issue.model");
const Employee = require("../models/employee.model");

const AdminSecretCode = process.env.AdminScrtCode

router.get("/AdminDetails", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send({ ok: false, error: "Unauthorized" });
    try {
        const decoded=await jwt.verify(token,AdminSecretCode);
        const admin = await Admin.findOne({ email: decoded.email }).populate({
            path: "departments.employees",
            model: "Employee",
            select: "name email phone password departmentName _id",
        }); 
        if (!admin) return res.status(404).send({ ok: false, error: "Admin not found" });
        const issues = await Issue.find();
        const Departments = admin.departments.map(d => ({
            name: d.name,
            description: d.description,
            head: d.head,
            email: d.email,
            employees: d.employees,

        }));
        res.send({ status: 'ok', Issues: issues, Departments: Departments });
    } catch (e) {
        res.send({ status: 'error', error: e });
    }
})

router.post("/AddEmployees", async (req, res) => {
    try {
        const { name, email, password, phone, departmentName } = req.body;
        // Create employee
        const employee = new Employee({
            name,
            email,
            password: password,
            phone,
            departmentName,
        });

        await employee.save();

        // Add employee to the admin's department
        // Assuming you have a single admin, e.g., the first one
        const admin = await Admin.findOne();
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const dept = admin.departments.find((d) => d.name === departmentName);
        if (!dept) return res.status(404).json({ message: "Department not found" });

        dept.employees.push(employee._id);

        await admin.save();

        res.status(201).json({ message: "Employee added successfully", employee });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
})

// DELETE Employee by _id
router.delete("/DeleteEmployee/:id", async (req, res) => {
    const empId = req.params.id; // employee _id to delete
    const token = req.headers.authorization; // optional: admin token to verify

    if (!token) return res.status(401).send({ ok: false, error: "Unauthorized" });

    try {
        // Verify admin token
        const decoded = jwt.verify(token, AdminSecretCode);

        // Find the admin
        const admin = await Admin.findOne({ email: decoded.email });
        if (!admin) return res.status(404).send({ ok: false, error: "Admin not found" });

        admin.departments.forEach((dept) => {
            if (dept.employees && dept.employees.length > 0) {
                dept.employees = dept.employees.filter(emp => emp._id.toString() !== empId);
            }
        });

        await admin.save();

        res.send({ ok: true, message: "Employee removed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ ok: false, error: "Failed to remove employee" });
    }
});

router.post("/issues/assign/:id", async (req, res) => {
    try {
        const { departmentName, employeeEmail } = req.body;

        // Find the issue by ID
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: "Issue not found" });

        // Find the employee by name (you can also match by email)
        const employee = await Employee.findOne({ email: employeeEmail });
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        // Update issue fields
        issue.status = "inprogress";
        issue.assigned_department = departmentName;
        issue.assigned_department_employee = employee.name;
        issue.assigned_date = new Date();

        await issue.save();


        // Push issue to the employee’s issue list
        if (!employee.issues.includes(issue._id)) {
            employee.issues.push(issue._id);
            await employee.save();
        }

        return res.status(200).json({
            ok: true,
            message: "Issue assigned successfully",
            issue,
        });
    } catch (err) {

        console.error("Error assigning issue:", err);
        res.status(500).json({
            message: "Internal server error", ok: false,
        });
    }
});
router.post("/issues/changeToResolved/:id", async (req, res) => {
    const issueId = req.params.id;
    const { departmentName, employeeEmail } = req.body;

    try {
        const issue = await Issue.findById(issueId);
        if (!issue) return res.status(404).json({ ok: false, error: "Issue not found" });

        // Check if assigned employee has finished
        if (!issue.assigned_employee_finished) {
            return res.status(400).json({
                ok: false,
                error: `${issue.assigned_employee} has not finished their job yet`,
            });
        }

        // Update issue status
        issue.status = "resolved";
        issue.resolved_date = new Date();

        await issue.save();

        res.json({ ok: true, message: "Issue marked as resolved", issue });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Server error" });
    }
})

module.exports=router;