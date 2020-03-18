const express = require('express')
const session = require('express-session')
const cors = require('cors')
const uuid = require('uuid/v4')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)

const User = require("./users/model")
const Task = require("./tasks/model")
const authMiddleware = require("./middleware/auth")
const { getTask, getTasks } = require("./tasks/services")

const sessionStore = new MongoStore({
    host: 'mongodb',
    port: '27017',
    db: 'lists',
    url: 'mongodb://mongodb:27017/lists'
});

// create the server
const app = express();

mongoose.connect('mongodb://mongodb/lists', { useNewUrlParser: true })

// add & configure middleware
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));


app.use(
    session({
        genid: (req) => {
            return uuid() // use UUIDs for session IDs
        },
        store: sessionStore,
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
    })
)

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Routes ***************************************************************************
app.get('/', (req, res) => {
    res.send(`You hit home page!\n`)
})

app.post('/tasks', (req, res, next) => {
    authMiddleware(req, res)

    const currentTimestamp = new Date().getTime()
    let task = new Task({
        key: "TAS-1",
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        status: req.body.status,
        priority: req.body.priority,
        version: req.body.version,
        labels: req.body.labels,
        author: req.user._id,
        timeTracking: req.body.timeTracking,
        dueAt: req.body.dueAt,
        timestamps: {
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp
        }
    })

    task.save()
       .then(doc => {
         res.status(200).json({result: 'Task created successfully.'})
       })
       .catch(err => {
         res.status(400).json({result: 'Wrong input data sent.'})
       })
})

app.get('/tasks', async (req, res, next) => {
    authMiddleware(req, res)

    const tasks = await getTasks(req.params.key)
    res.status(200).json(tasks)
})

app.get('/task/:key', async (req, res, next) => {
    authMiddleware(req, res)

    const task = await getTask(req.params.key)
    res.status(200).json(task)
})

app.get('/ping', (req, res) => {
    res.json({
        message: 'Ping!'
    })
})

app.post('/login', (req, res, next) => {
    User.authenticate()(req.body.username, req.body.password, function(err, result) {
        if (!result) {
            res.status(401).json({
                error: {
                    code: 401,
                    message: 'Invalid credentials!'
                }
            })
        }
        req.login(result, (err) => {
            res.status(200).json({
                success: {
                    code: 200,
                    message: 'You were authenticated & logged in!'
                }
            })
        })
    });
})

app.get('/logout', (req, res, next) => {
    req.logout()
    req.session.destroy()
    res.status(401).json({result: 'Logged out!'})
})

app.get('/testauth', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.status(200).json({result: 'Authenticated'})
    } else {
        res.status(401).json({result: 'Unauthenticated'})
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
            if (!result) {
                res.send('Something is wrong')
            }
            req.login(result, (err) => {
                return res.send('You were authenticated & logged in!');
            })
        });
    });
})

app.listen(3000, '0.0.0.0', () => {
    console.log('Listening on localhost:3000')
})