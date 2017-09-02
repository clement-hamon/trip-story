const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");

const users = require('./routes/users');
const config = require('./config/database');
const passportAuth = require('./config/passport');

const app = express();

const port = 3000;

// --------------------------------- DATABASE

// DB connection
mongoose.connect(config.database);

// DB connection successfull
mongoose.connection.on('connected', function(){
   console.log('connected to database' + config.database );
});

// DB connection fail
mongoose.connection.on('error', function(err){
    console.log('error while connecting to database: ' + err);
});

// --------------------------------- MIDDLEWARE

// allow cross origin request
app.use(cors());

// Body parser
app.use(bodyParser.json());

// Passport - Authentification system
app.use(passport.initialize());
// authentification by JWT
passportAuth(passport);

// Define static files path
app.use(express.static(path.join(__dirname, 'public'))); // path is a native node object

// --------------------------------- ROUTING

// user routing
app.use('/users', users);

// index route
app.get("/", function(req, res){
    res.send('it\'s an invalid end point');
});

// --------------------------------- START SERVER
app.listen(port, function(){
   console.log("app started on port " + port);
});
