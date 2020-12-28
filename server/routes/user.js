const express = require("express");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const {OAuth2Client} = require('google-auth-library');
const router = express.Router();

const User = require("../models/user");
const Application = require("../models/application");
const client = new OAuth2Client("428799205209-2njsnee31fvi9mhv5nrqah05iffvhm8g.apps.googleusercontent.com");

router.post("/applications", (req, res) => {
    var token = req.body.token;
    jwt.verify(token, process.env.JWT_SIGNIN_KEY, (err, decoded) => {
        if(!err){
            const {_id} = decoded;
            
        User.find({_id: _id}).select('applications').sort({createdAt: 'descending'})
        .exec()
        .then((docs) => {
            res.status(200).json(docs);
        });
        } else {
            res.status(401).json({access: 'denied'});
        }
    })
});

router.post("/createApplication", (req, res) => {
    var token = req.body.token;
    jwt.verify(token, process.env.JWT_SIGNIN_KEY, (err, decoded) => {
        if(!err){
            const {_id} = decoded;
            const appData = req.body.appData;
            const application = new Application({
                _id: new mongoose.Types.ObjectId(),
                appliedDate: appData.appliedDate,
                companyName: appData.companyName,
                position: appData.position,
                interviewer: appData.interviewer,
                status: appData.status,
                interviewTime: appData.interviewTime,
                followUp: appData.followUp,
                documentsSubmitted: appData.documentsSubmitted,
                notes: appData.notes
            });

            User.findByIdAndUpdate({_id}, {$push: {'applications': application}}, { safe: true, upsert: true },
            function (err) {
              if (err) {
                return res.send(err);
              }
              return res.status(201).json({message: "Application created on server."});}
              );
        } else {
            res.status(401).json({access: 'denied'});
        }
    })
});

router.post("/verify", (req, res) => {
    var token = req.body.token;
    jwt.verify(token, process.env.JWT_SIGNIN_KEY, (err, decoded) => {
        if(!err){
            res.status(200).json({access: 'granted', name: decoded.name});
        } else {
            res.status(401).json({access: 'denied'});
        }
    })
});


module.exports = router;
