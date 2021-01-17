const express = require("express");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const {OAuth2Client} = require('google-auth-library');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;

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

router.post("/applications/remove",  (req, res) => {
    var token = req.body.token;
    jwt.verify(token, process.env.JWT_SIGNIN_KEY, (err, decoded) => {
        if(!err) {
            const {_id} = decoded;
            const removeId = req.body.removeId;
            User.updateOne({_id: new ObjectId(_id)},
                {$pull: {applications: { _id: new ObjectId(removeId)}}}
            ).exec().then(() => {
                res.status(200).json({
                    access: 'granted',
                    status: 'Success'    
                })
            });
        } else {
            res.status(401).json({access: 'denied'})
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
                location: appData.location,
                contacts: appData.contacts,
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
              return res.status(201).json({message: "Application created in database."});}
              );
        } else {
            res.status(401).json({access: 'denied'});
        }
    })
});

router.post("/updateApplication", (req, res) => {
    var token = req.body.token;
    jwt.verify(token, process.env.JWT_SIGNIN_KEY, (err, decoded) => {
        if(!err){
            const {_id} = decoded;
            const appData = req.body.appData;

            User.findOneAndUpdate({_id, 'applications._id': new ObjectId(appData._id)}, 
            {$set: 
                {
                    "applications.$.companyName": appData.companyName,
                    "applications.$.position": appData.position,
                    "applications.$.appliedDate": appData.appliedDate,
                    "applications.$.location": appData.location,
                    "applications.$.interviewer": appData.interviewer,
                    "applications.$.contacts": appData.contacts,
                    "applications.$.status": appData.status,
                    "applications.$.interviewTime": appData.interviewTime,
                    "applications.$.followUp": appData.followUp,
                    "applications.$.documentsSubmitted": appData.documentsSubmitted,
                    "applications.$.notes": appData.notes
                }}, { new: true },
            function (err) {
              if (err) {
                return res.send(err);
              }
              return res.status(201).json({message: "Application created in database."});}
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
