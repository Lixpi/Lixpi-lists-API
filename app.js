
var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    User = require("./models/account"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://mongodb:27017/lists", { useNewUrlParser: true });
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret:"Miss white is my cat",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===================
//     ROUTES
// ===================



app.get("/",function(req, res){
   res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

app.get("/register", function(req, res){
    res.render("register");
});

// handeling user sign up
app.post("/register", function(req, res){
    // console.log(req.body.username);
    // console.log(req.body.password);
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});

// Login Form
app.get("/login", function(req, res){
    res.render("login");
});

// Login Logic
// middleware
app.post("/login", passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){

});

// Logout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

// check isLoggedIn
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(3000, () => {
  console.log('Listening on localhost:3000')
})

















































// //npm modules
// const express = require('express');
// const uuid = require('uuid/v4')
// const session = require('express-session')
// const mongoose = require('mongoose')
// const MongoStore = require('connect-mongo')(session)
// const bodyParser = require('body-parser')
// const passport = require('passport')
// const LocalStrategy = require('passport-local').Strategy

// var Account = require('./models/account');

// const users = [
//   {id: '2f24vvg', username: 'nargiza', password: 'password'}
// ]

// // configure passport.js to use the local strategy
// passport.use(new LocalStrategy(
//   { usernameField: 'username' },
//   (username, password, done) => {
//     console.log('Inside local strategy callback')
//     // here is where you make a call to the database
//     // to find the user based on their username or username address
//     // for now, we'll just pretend we found that it was users[0]
//     const user = users[0]
//     if(username === user.username && password === user.password) {
//       console.log('Local strategy returned true')
//       return done(null, user)
//     }
//   }
// ));

// // passport.serializeUser(Account.serializeUser());
// // passport.deserializeUser(Account.deserializeUser());

// // tell passport how to serialize the user
// passport.serializeUser((user, done) => {
//   console.log('Inside serializeUser callback. User id is save to the session file store here')
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   console.log('Inside deserializeUser callback')
//   console.log(`The user id passport saved in the session file store is: ${id}`)
//   const user = users[0].id === id ? users[0] : false;
//   done(null, user);
// });

// // create the server
// const app = express();

// var sessionStore = new MongoStore({
//     host: 'mongodb',
//     port: '27017',
//     db: 'lists',
//     url: 'mongodb://mongodb:27017/lists'
// });

// mongoose.connect('mongodb://localhost/lists')

// // add & configure middleware
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
// app.use(session({
//   genid: (req) => {
//     console.log('Inside the session middleware')
//     console.log(req.sessionID)
//     return uuid() // use UUIDs for session IDs
//   },
//   store: sessionStore,
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true
// }))
// app.use(passport.initialize());
// app.use(passport.session());

// // create the homepage route at '/'
// app.get('/', (req, res) => {
//   console.log('Inside the homepage callback function')
//   console.log(req.sessionID)
//   res.send(`You hit home page!\n`)
// })

// app.post("/register", function(req, res){
//     // console.log(req.body.username);
//     // console.log(req.body.password);
//     Account.register(new Account({username: req.body.username}), req.body.password, function(err, user){
//         if(err){
//             console.log(err);
//             return res.render("register");
//         }
//         passport.authenticate("local")(req, res, function(){
//             res.redirect("/secret");
//         });
//     });
// });

// // create the login get and post routes
// app.get('/login', (req, res) => {
//   console.log('Inside GET /login callback function')
//   console.log(req.sessionID)
//   res.send(`You got the login page!\n`)
// })

// app.post('/login', (req, res, next) => {
//   console.log('Inside POST /login callback')
//   passport.authenticate('local', (err, user, info) => {
//     // console.log('Inside passport.authenticate() callback');
//     // console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
//     // console.log(`req.user: ${JSON.stringify(req.user)}`)
//     req.login(user, (err) => {
//       // console.log('Inside req.login() callback')
//       // console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
//       // console.log(`req.user: ${JSON.stringify(req.user)}`)
//       return res.send('You were authenticated & logged in!\n');
//     })
//   })(req, res, next);
// })

// app.get('/authrequired', (req, res) => {
//   console.log('Inside GET /authrequired callback')
//   console.log(`User authenticated? ${req.isAuthenticated()}`)
//   if(req.isAuthenticated()) {
//     res.send('you hit the authentication endpoint\n')
//   } else {
//     res.redirect('/')
//   }
// })

// // tell the server what port to listen on
// app.listen(3000, () => {
//   console.log('Listening on localhost:3000')
// })
