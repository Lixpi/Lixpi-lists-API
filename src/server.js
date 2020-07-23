const express = require('express')
const session = require('express-session')
const cors = require('cors')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const userQueries = require('./user/repository')

const indexRoute = require('./routes/index')
const projectsRoute = require('./routes/projects/projects')
const tasksRoute = require('./routes/tasks/tasks')
const taskRoute = require('./routes/tasks/task')
const loginRoute = require('./routes/login')
const logoutRoute = require('./routes/logout')
const testAuthRoute = require('./routes/testauth')
const registerRoute = require('./routes/register')

const { Session } = require('./session/model')

//TEMP
const { User } = require('./user/model');

(async () => {
    const qq = await User.findById('ab1c8aa3-e54e-42b8-a9cc-4d41617046cf')
})()


const KnexSessionStore = require('connect-session-knex')(session)
const { knex } = require('./db/knex')

const app = express()
app.use(express.json())

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

const passportConfig = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => Promise.resolve()
        .then(async () => {
            // console.log('id')
            // console.log(id)
            const user = await userQueries.getUserById(id)
            // console.log('user')
            // console.log(user)

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
            const user = await userQueries.getUserByUsername(username)
            console.log('user!!!!!!!!!!!!!!!!!!')
            console.log(user)
            // if (!user || !await user.comparePassword(password)) {
            // TEMP
            if (!user || !await User.comparePassword(password, user[0].password)) {
                return done(null, null)
            }
            return done(null, user[0])
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
app.post('/projects', projectsRoute.post)
app.get('/tasks', tasksRoute.get)
app.post('/tasks', tasksRoute.post)
app.get('/task/:key', taskRoute.get)
app.post('/login', loginRoute.post)
app.get('/logout', logoutRoute.get)
app.get('/testauth', testAuthRoute.get)
app.post('/register', registerRoute.post)

app.listen(3000, '0.0.0.0', () => {
    console.log('Listening on localhost:3000')
})
