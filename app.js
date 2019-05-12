//npm modules
const express = require('express');
const uuid = require('uuid/v4')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require("./models/account")

const users = [
  {id: '2f24vvg', email: 'test@test.com', password: 'password'}
]


// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    console.log('Inside local strategy callback')
    // here is where you make a call to the database
    // to find the user based on their username or email address
    // for now, we'll just pretend we found that it was users[0]
    const user = users[0]
    if(email === user.email && password === user.password) {
      console.log('Local strategy returned true')
      return done(null, user)
    }
  }
));

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  console.log('Inside serializeUser callback. User id is save to the session file store here')
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('Inside deserializeUser callback')
  console.log(`The user id passport saved in the session file store is: ${id}`)
  const user = users[0].id === id ? users[0] : false;
  done(null, user);
});

// create the server
const app = express();

var sessionStore = new MongoStore({
    host: 'mongodb',
    port: '27017',
    db: 'lists',
    url: 'mongodb://mongodb:27017/lists'
});

mongoose.connect('mongodb://mongodb/lists')

// add & configure middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  genid: (req) => {
    console.log('Inside the session middleware')
    console.log(req.sessionID)
    return uuid() // use UUIDs for session IDs
  },
  store: sessionStore,
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

// create the homepage route at '/'
app.get('/', (req, res) => {
  console.log('Inside the homepage callback function')
  console.log(req.sessionID)
  res.send(`You hit home page!\n`)
})

// create the login get and post routes
app.get('/login', (req, res) => {
  console.log('Inside GET /login callback function')
  console.log(req.sessionID)
  res.send(`You got the login page!\n`)
})

app.post('/login', (req, res, next) => {
  console.log('Inside POST /login callback')
  passport.authenticate('local', (err, user, info) => {
    console.log('Inside passport.authenticate() callback');
    console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
    console.log(`req.user: ${JSON.stringify(req.user)}`)
    req.login(user, (err) => {
      console.log('Inside req.login() callback')
      console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
      console.log(`req.user: ${JSON.stringify(req.user)}`)
      return res.send('You were authenticated & logged in!\n');
    })
  })(req, res, next);
})

app.get('/authrequired', (req, res) => {
  console.log('Inside GET /authrequired callback')
  console.log(`User authenticated? ${req.isAuthenticated()}`)
  if(req.isAuthenticated()) {
    res.send('you hit the authentication endpoint\n')
  } else {
    res.redirect('/')
  }
})

app.set('view engine', 'html');

// handeling user sign up
app.post("/register", function(req, res){
    console.log(req.body);
    console.log('ffffffffffffffffffffffffffffffffffffff')
    // User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    //     console.log('ssssssssssssssssssssssssssssssssssss')
    //     if(err){
    //         console.log('errrrrrrrrrrrrrrrrrrrrrr')
    //         console.log(err);
    //         // return res.render("register");
    //     }
    //     // passport.authenticate("local")(req, res, function(){
    //     //     res.redirect("/authrequired");
    //     // });
    // });

    // Users=new User({email: 'asef@df.com', username : req.body.username});

    //       User.register(Users, req.body.password, function(err, user) {
    //         if (err) {
    //           res.json({success:false, message:"Your account could not be saved. Error: ", err})
    //         }else{
    //           res.json({success: true, message: "Your account has been saved"})
    //         }
    //       });


    User.register(new User({ username : req.body.username, email: 'sdf@dfdf.com' }), req.body.password, function(err, account) {
        console.log('  0000000000000000 account')
        console.log(account)
         if (err) {
          res.json({success:false, message:"Your account could not be saved. Error: ", err})
        }else{
          res.json({success: true, message: "Your account has been saved"})
        }

        passport.authenticate('local')(req, res, function () {
          res.redirect('/');
        });
    });


})

// // handeling user sign up
// app.post("/register", function(req, res){
//     // console.log(req.body.username);
//     // console.log(req.body.password);
//     console.log('---------------------')
//     console.log(req.body)

//     // create the user
//     let newUser            = new User();

//     console.log(' ------------------------- newUser');
//     console.log(newUser);

//     // set the user's local credentials
//     newUser.username    = req.body.username;
//     newUser.password = req.body.password;

//     console.log(' ------------------------- newUser 2');
//     console.log(newUser);

//     // // save the user
//     newUser.save(function(err) {
//     if (err)
//         throw err;
//         return done(null, newUser);
//     });



//     // User.register(new User({username: req.body.username}), req.body.password, function(err, user){
//     //     console.log('sadfasdfasdf')
//     //     if(err){
//     //         console.log(err);
//     //         return res.render("register");
//     //     }
//     //     passport.authenticate("local")(req, res, function(){
//     //         res.redirect("/authrequired");
//     //     });
//     // });
// });

// tell the server what port to listen on
app.listen(3000, () => {
  console.log('Listening on localhost:3000')
})
