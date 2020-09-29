'use strict'

const express = require('express')
const session = require('express-session')
const cors = require('cors')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const indexRoute = require('./routes/index')
const projectsRoute = require('./routes/projects/projects')
const projectRoute = require('./routes/projects/project')

const tasksRoute = require('./routes/tasks/tasks')
const taskRoute = require('./routes/tasks/task')

const typesRoute = require('./routes/types/types')
const typeRoute = require('./routes/types/type')

const statusesRoute = require('./routes/statuses/statuses')
const statusRoute = require('./routes/statuses/status')

const prioritiesRoute = require('./routes/priorities/priorities')
const priorityRoute = require('./routes/priorities/priority')

const labelsRoute = require('./routes/labels/labels')
const labelRoute = require('./routes/labels/label')

const versionsRoute = require('./routes/versions/versions')
const versionRoute = require('./routes/versions/version')

const loginRoute = require('./routes/login')
const logoutRoute = require('./routes/logout')
const testAuthRoute = require('./routes/testauth')
const registerRoute = require('./routes/register')

const KnexSessionStore = require('connect-session-knex')(session)
const { knex } = require('./db/knex')
const { User } = require('./models/user')

const app = express()
app.use(express.json())

app.use(cors({
    origin: 'http://localhost:5000',
    credentials: true
}))

const passportConfig = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => Promise.resolve()
        .then(async () => {
            const user = await User.findById(id)
            done(null, user)
        })
        .catch(done))
    passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
    },
    (req, username, password, done) => Promise.resolve()
        .then(async () => {
            const user = await User.findByUsername(username)
            if (!user || !await User.comparePassword(password)) {
                return done(null, null)
            }
            return done(null, user)
        })
        .catch(done),
    ))
}

passportConfig(passport)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
    },
    store: new KnexSessionStore({
        knex,
        tablename: 'sessions'
    }),
}))
app.use(passport.initialize())
app.use(passport.session())

// Routes ******************************************
app.get('/', indexRoute.get)

app.get('/projects', projectsRoute.get)
app.post('/projects', projectsRoute.post)
app.get('/project/:key', projectRoute.get)

app.get('/tasks', tasksRoute.get)
app.post('/tasks', tasksRoute.post)
app.get('/task/:key', taskRoute.get)
app.delete('/task/:id', taskRoute.del)

app.get('/types', typesRoute.get)
app.post('/types', typesRoute.post)
app.get('/type/:id', typeRoute.get)
app.delete('/type/:id', typeRoute.del)

app.get('/statuses', statusesRoute.get)
app.post('/statuses', statusesRoute.post)
app.get('/status/:id', statusRoute.get)
app.delete('/status/:id', statusRoute.del)

app.get('/priorities', prioritiesRoute.get)
app.post('/priorities', prioritiesRoute.post)
app.get('/priority/:id', priorityRoute.get)
app.delete('/priority/:id', priorityRoute.del)

app.get('/labels', labelsRoute.get)
app.post('/labels', labelsRoute.post)
app.get('/label/:id', labelRoute.get)
app.delete('/label/:id', labelRoute.del)

app.get('/versions', versionsRoute.get)
app.post('/versions', versionsRoute.post)
app.get('/version/:id', versionRoute.get)
app.delete('/version/:id', versionRoute.del)

app.post('/login', loginRoute.post)
app.get('/logout', logoutRoute.get)

app.get('/testauth', testAuthRoute.get)

app.post('/register', registerRoute.post)

app.listen(3000, '0.0.0.0', () => {
    console.log('Listening on localhost:3000')
})
