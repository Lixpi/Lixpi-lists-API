const express = require('express')
const session = require('express-session')
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

// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
// }))

// TODO temporary db init
const { User } = require('./user/model')
const { Session } = require('./session/model')
const { Label } = require('./label/model')
const { Type } = require('./task/type/model')
const { Status } = require('./task/status/model')
const { Priority } = require('./task/priority/model')
const { Role } = require('./role/model')
const { Task, TaskLabel, TaskType, TaskStatus, TaskPriority, TaskAssignee } = require('./task/model')

async () => {
    await User.sync({ alter: true })
    await Session.sync({ alter: true })
    await Task.sync({ alter: true })
    await Label.sync({ alter: true })
    await Type.sync({ alter: true })
    await Status.sync({ alter: true })
    await Priority.sync({ alter: true })
    await Role.sync({ alter: true })
    await TaskAssignee.sync({ alter: true })
    await TaskLabel.sync({ alter: true })
    await TaskType.sync({ alter: true })
    await TaskStatus.sync({ alter: true })
    await TaskPriority.sync({ alter: true })
}
// () // Uncomment to call init db func



async () => {
    const nargiza = await userQueries.getUserByUsername('nargiza')
    // const nargiza1 = await userQueries.getUserByUsername('nargiza1')
    Promise.all([
        Task.create({ key: 'key2', title: 'title', description: ''}),
        Label.create({ title: 'label1', color: 'red' }),
        Type.create({ type: 'type1' }),
        Status.create({ status: 'status1' }),
        Priority.create({ priority: 'priority1' }),
        Role.create({ role: 'role1' })
    ])
        .then(([task, label, type, status, priority, role]) => {
            task.setAuthor(nargiza)
            task.addLabel(label)
            task.addType(type)
            task.addStatus(status)
            task.addPriority(priority)
            TaskAssignee.create({ roleRole: role.role, TaskKey: task.key, UserId: nargiza.id })
        })
}
// ()

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
