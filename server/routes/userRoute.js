const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require('dotenv').config();

const User = require("../models/user.model");
const Issue = require("../models/issue.model");

const UsersecretCode =process.env.UserScrtCode;


router.post("/DeleteIssue/:id",async(req,res)=>{
    const token=req.headers.authorization;
    try{
        const decoded = jwt.verify(token, UsersecretCode);
        const user=await User.findOne({email:decoded.email});
        if(!user) res.send({status:'error'});
        const id=req.params.id;
        const response=await Issue.deleteOne({_id:id});
        user.issues = user.issues.filter(issueId => issueId.toString() !== id);
        console.log("dwaidu");
        await user.save();
        res.send({status:"ok"}); 
    }catch(e){
        res.send({status:"error"});
    }
})

router.put("/setRating/:id",async(req,res)=>{
    const rating=req.body.rating;
    const feedback=req.body.feedback;
    const token=req.headers.authorization;

    try{
        const decoded = jwt.verify(token, UsersecretCode);
        const issue=await Issue.findById(req.params.id);
        if(!issue) return res.status(401).send({ ok: false, error: "No Issue Found" });
        issue.rating=rating;
        issue.user_feedback=feedback;
        await issue.save();
        res.send({ok:true})
    }catch(e){
        res.status(401).send({ ok: false, error: "No User Found" })

    }
})

router.get("/issues", async (req, res) => {
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

router.post("/Generateissue", async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send({ ok: false, error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, UsersecretCode);

        const user = await User.findOne({ email: decoded.email });
        if (!user) return res.status(404).send({ ok: false, error: "User not found" });

        const issueData = req.body;

        if (!issueData.is_anonymous) {
            issueData.reporter_name = user.name;
            issueData.reporter_email = user.email;
        }

        const issue = await Issue.create({ ...issueData });

        user.issues.push(issue._id);
        await user.save();

        res.send({ ok: true, status: "ok", id: issue._id, message: "Issue added to pending" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ ok: false, error: "Failed to add issue" });
    }
});

module.exports=router;
