const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

require('dotenv').config();

const Issue = require("../models/issue.model");
const Employee = require("../models/employee.model");

const AdminSecretCode = process.env.AdminScrtCode


router.get("/employeeDetails", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send({ ok: false, error: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, AdminSecretCode);
        const employee=await Employee.findOne({email:decoded.email}).populate("issues");

        if(!employee) return res.status(401).send({ ok: false, error: "No User Found" });
        res.send({ok:true,details:employee});
    } catch (e) {
        return res.status(401).send({ ok: false, error: e });
    }
})

router.get("/EmployeeFinishedIssue/:id",async (req,res) => {
    const token=req.headers.authorization;
    if (!token) return res.status(401).send({ ok: false, error: "Unauthorized" });
    const id=req.params.id;
    try{
        const decoded = jwt.verify(token, AdminSecretCode);
        const issue=await Issue.findById(id);
        if(!issue) return res.status(401).send({ ok: false, error: "No Issue Found" });
        issue.assigned_employee_finished=true;
        await issue.save();
        res.send({ok:true});
    }catch(e){
        res.status(401).send({ ok: false, error: "No User Found" })
    }
})

module.exports=router;
