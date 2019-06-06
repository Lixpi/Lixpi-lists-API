const bodyParser = require('body-parser')
const uuid = require('uuid/v4')

const express = require('express');
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)

const User = require("./user/model")

const users = [{
    id: '2f24vvg',
    email: 'test@test.com',
    password: 'password'
}]

// configure passport.js to use the local strategy
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    (email, password, done) => {
        console.log('Inside local strategy callback')
        // here is where you make a call to the database
        // to find the user based on their username or email address
        // for now, we'll just pretend we found that it was users[0]
        const user = users[0]
        if (email === user.email && password === user.password) {
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
app.use(bodyParser.urlencoded({
    extended: false
}))
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

app.get('/ping', (req, res) => {
    console.log('Inside the ping callback function')
    console.log(req.sessionID)
    res.send(`Ping!\n`)
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

app.get('/testauthrequired', (req, res) => {
    console.log('Inside GET /authrequired callback')
    console.log(`User authenticated? ${req.isAuthenticated()}`)
    if (req.isAuthenticated()) {
        res.send('You hit the authenticated endpoint\n')
    } else {
        res.redirect('/')
    }
})

// handeling user sign up
app.post('/register', (req, res, next) => {
    User.register(new User({
        username: req.body.username,
        email: 'sdf@dfdf.com'
    }), req.body.password, (err, account) => {
        if (err) {
            res.json({
                success: false,
                message: "Your account could not be saved. Error: ",
                err
            })
        } else {
            res.json({
                success: true,
                message: "Your account has been saved"
            })
        }

        passport.authenticate('local')(req, res, function() {
            res.redirect('/');
        });
    });
})

app.listen(3000, () => {
    console.log('Listening on localhost:3000')
})