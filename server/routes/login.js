const express = require("express");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const {OAuth2Client} = require('google-auth-library');
const router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const client = new OAuth2Client("428799205209-2njsnee31fvi9mhv5nrqah05iffvhm8g.apps.googleusercontent.com");

const User = require("../models/user");

const googlelogin = (req, res) => {
    const {tokenId} = req.body;

    client.verifyIdToken({idToken: tokenId, audience: "428799205209-2njsnee31fvi9mhv5nrqah05iffvhm8g.apps.googleusercontent.com"}).then( response => {
        const {email, email_verified, name} = response.payload;
        if(email_verified){
            User.findOne({username: email}).exec((err, user) => {
                if(err){
                    return res.status(400).json({error: "Something went wrong."});
                } else {
                    if(user){
                        // User already exists in the database.
                        const token = jwt.sign({_id: user._id, name: user.name}, process.env.JWT_SIGNIN_KEY, {expiresIn: '1d'});
                        const {_id, name, email} = user;

                        res.status(202).json({
                            token,
                            user: {_id, name, email}
                        })
                    } else {
                        // User needs to be created in the database.
                        let password = bcrypt.genSalt(10).then(salt => {return bcrypt.hash(email+name+"!!#", salt)}).then(hash => {
                            let newUser = new User({
                                _id: new mongoose.Types.ObjectId(),
                                name: name,
                                username: email,
                                password: hash,
                            });
                            newUser.save((err, data) => {
                                if(err){
                                    return res.status(400).json({error: "Something went wrong."});
                                }
                                const token = jwt.sign({_id: data._id, name: data.name}, process.env.JWT_SIGNIN_KEY, {expiresIn: '1d'});
                                const {_id, name, email} = newUser;
        
                                res.json({
                                    token,
                                    user: {_id, name, email}
                                })
                            })
                        }).catch(err => console.error(err.message));
                    }
                }
            })
        }
    })
}  

  router.post('/googlelogin', googlelogin);
  
module.exports = router;
