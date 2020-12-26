const express = require("express");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const {OAuth2Client} = require('google-auth-library');
const router = express.Router();

const User = require("../models/user");
const client = new OAuth2Client("428799205209-2njsnee31fvi9mhv5nrqah05iffvhm8g.apps.googleusercontent.com");

router.post("/applications", (req, res) => {
    var token = req.body.token;
    jwt.verify(token, process.env.JWT_SIGNIN_KEY, (err, decoded) => {
        if(!err){
            const {_id} = decoded;
            
        User.find({_id: _id}).distinct('applications')
        .exec()
        .then((docs) => {
            res.status(200).json(docs);
        });
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
