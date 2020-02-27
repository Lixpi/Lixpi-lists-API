const express = require('express')
const session = require('express-session')
const uuid = require('uuid/v4')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const User = require("./users/model")

const sessionStore = new MongoStore({
    host: 'mongodb',
    port: '27017',
    db: 'lists',
    url: 'mongodb://mongodb:27017/lists'
});

// create the server
const app = express();

mongoose.connect('mongodb://mongodb/lists')

// add & configure middleware
app.use(express.json());

app.use(session({
    genid: (req) => {
        return uuid() // use UUIDs for session IDs
    },
    store: sessionStore,
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Routes ***************************************************************************
app.get('/', (req, res) => {
    res.send(`You hit home page!\n`)
})

app.get('/ping', (req, res) => {
    res.send(`Ping!\n`)
})

app.post('/login', (req, res, next) => {
    User.authenticate()(req.body.username, req.body.password, function(err, result) {
        if (!result) {
            res.send('Invalid credentials')
        }
        req.login(result, (err) => {
            return res.send('You were authenticated & logged in!');
        })
        // return res.send('Welcome!')
    });
})

app.get('/logout', (req, res, next) => {
    req.logout()
    res.redirect('/')
})

app.get('/testauthrequired', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Authenticated')
    } else {
        res.send('Unauthenticated')
    }
})

// handeling user sign up
app.post('/register', (req, res, next) => {
    User.register({username: req.body.username, active: false}, req.body.password, function(err, user) {
        if (err) {
            res.json({
                success: false,
                message: "Your account could not be saved. Error: ",
                err
            })
        }
        User.authenticate()(req.body.username, req.body.password, function(err, result) {
            if (err) {
                console.log('err')
                console.log(err)
            }
            if (!result) {
                res.send('Something is wrong')
            }
            req.login(result, (err) => {
                return res.send('You were authenticated & logged in!');
            })
        });
    });
})

app.listen(3000, () => {
    console.log('Listening on localhost:3000')
})