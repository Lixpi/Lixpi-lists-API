const express = require('express')
const session = require('express-session')
const cors = require('cors')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const sequelize = require('./db/sequelize-singleton')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

const userQueries = require('./user/services')

const indexRoute = require('./routes/index')
const tasksRoute = require('./routes/tasks/tasks')
const taskRoute = require('./routes/tasks/task')
const loginRoute = require('./routes/login')
const logoutRoute = require('./routes/logout')
const testAuthRoute = require('./routes/testauth')
const registerRoute = require('./routes/register')

const app = express()
app.use(express.json())

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

//--------------- Models sync ---------------//
const { User } = require('./user/model')
const { Session } = require('./session/model')
const { Label } = require('./label/model')
const { Type } = require('./task/type/model')
const { Status } = require('./task/status/model')
const { Priority } = require('./task/priority/model')
const { Role } = require('./role/model')
const { Task, TaskLabel, TaskType, TaskStatus, TaskPriority, UserRole, TaskAssignee } = require('./task/model')

void (async () => {
    await User.sync({ alter: true, force:true })
    await Session.sync({ alter: true, force:true })
    await Task.sync({ alter: true, force:true })
    await Label.sync({ alter: true, force:true })
    await Type.sync({ alter: true, force:true })
    await Status.sync({ alter: true, force:true })
    await Priority.sync({ alter: true, force:true })
    await Role.sync({ alter: true, force:true })
    await UserRole.sync({ alter: true, force:true })
    await TaskAssignee.sync({ alter: true, force:true })
    await TaskLabel.sync({ alter: true, force:true })
    await TaskType.sync({ alter: true, force:true })
    await TaskStatus.sync({ alter: true, force:true })
    await TaskPriority.sync({ alter: true, force:true })
})
// ()
//------------------------------------------//

const passportConfig = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => Promise.resolve()
        .then(async () => {
            const user = await userQueries.getUserById(id)

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
            if (!user || !await user.comparePassword(password)) {
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
    store: new SequelizeStore({
        db: sequelize,
        table: 'Session',
    }),
}))
app.use(passport.initialize())
app.use(passport.session())


// Routes ******************************************
app.get('/', indexRoute.get)
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
