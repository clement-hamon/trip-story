const express = require('express');
const router = express.Router();
const passport = require('passport');

const Story = require('../models/stories');

router.post('/', passport.authenticate('jwt', {session: false}), function(req,res,next) {
    let newStory = new Story({
        title: req.body.title,
        author: req.body.author,
        text: req.body.text,
        coordinates: req.body.coordinates
    });

    Story.save(newStory,function(err, user){
        if(err){
            res.json({success: false, msg: 'Failed to register new user'});
        } else {
            res.json({success: true, msg: 'New user successfully registered'});
        }
    });
});

module.exports = router;