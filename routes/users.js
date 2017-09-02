const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../models/users');
const configDb = require('../config/database');


router.post('/register', function(req,res,next) {
    let newUser = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        username: req.body.username
    });

    User.addUser(newUser,function(err, user){
        if(err){
            res.json({success: false, msg: 'Failed to register new user'});
        } else {
            res.json({success: true, msg: 'New user successfully registered'});
        }
    });
});

router.post('/authenticate', function(req,res,next) {
    const username = req.body.username;
    const password = req.body.password;

    // find the user by name
    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: 'User not found'});
        }
        // compare the candidate password with the hash
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user, configDb.secret, { expiresIn: 604800 });

                return res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                })
            } else {
                return res.json({success: false, msg: 'Wrong password'});
            }
        });
    })
});

router.get('/profile', passport.authenticate('jwt', {session: false}), function(req,res,next) {
    res.json({
        user: req.user
    })
});

module.exports = router;