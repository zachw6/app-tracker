const express = require("express");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const {OAuth2Client} = require('google-auth-library');
const router = express.Router();

const User = require("../models/user");
const client = new OAuth2Client("428799205209-2njsnee31fvi9mhv5nrqah05iffvhm8g.apps.googleusercontent.com");

router.get("/dashboard", (req, res) => {
    var token = req.query.token;
    jwt.verify(token, process.env.JWT_SIGNIN_KEY, (err, decoded) => {
        if(!err){
            res.send("Here is the dashboard!");
            console.log(decoded);
        } else {
            res.send(err);
        }
    })
});

module.exports = router;
