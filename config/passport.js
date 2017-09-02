const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/users');
const secretKey = require('../config/database').secret;

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = secretKey;

// authentification by jwt
module.exports = function(passport) {
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.getUserById(jwt_payload._doc._id, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
    }));
}