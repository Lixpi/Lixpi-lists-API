const Bluebird = require('bluebird');
const express = require('express')
const session = require('express-session')
const cors = require('cors')
const uuid = require('uuid/v4')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { Sequelize } = require('sequelize');
const sequelize = require('./db/sequelize-singleton');
const SequelizeStore = require('connect-session-sequelize')(session.Store);


const userQueries = require('./user/services');

const indexRoute = require('./routes/index')
const tasksRoute = require('./routes/tasks/tasks')
const taskRoute = require('./routes/tasks/task')
const loginRoute = require('./routes/login')
const logoutRoute = require('./routes/logout')
const testAuthRoute = require('./routes/testauth')
const registerRoute = require('./routes/register')


// create the server
const app = express();

// add & configure middleware
app.use(express.json());

// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
// }));

// TODO temporary db init
const { User } = require('./user/model');
const { Session } = require('./session/model');
const { Label } = require('./label/model');
const { Task, TaskLabel } = require('./task/model');
(async () => {
  await User.sync({ alter: true })
  await Session.sync({ alter: true })
  await Task.sync({ alter: true })
  await Label.sync({ alter: true })
  await TaskLabel.sync({ alter: true })
})
// () // Uncomment to call init db func



const temp = async() => {
    Promise.all([
        Task.create({ key: 'key2', title: 'title',description: ''}),
        Label.create({ title: 'label1', color: 'red' }),
        Label.create({ title: 'label2', color: 'green' })
    ])
    .then(([task, label1, label2]) => TaskLabel.create({TaskKey: task.key, LabelId: label1.title}))
}
temp()

const passportConfig = (passport) => {
    passport.serializeUser((user, done) => {
      done(null, user.userId);
    });

    passport.deserializeUser((id, done) => Bluebird.resolve()
      .then(async () => {
        const user = await userQueries.getUserById(id);

        done(null, user);
      })
      .catch(done));

    passport.use('local', new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
      },
      (req, username, password, done) => Bluebird.resolve()
        .then(async () => {
          const user = await userQueries.getUserByUsername(username);

          if (!user || !await user.comparePassword(password)) {
            return done(null, null);
          }

          return done(null, user);
        })
        .catch(done),
    ));
  };



  passportConfig(passport);
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month
    },
    store: new SequelizeStore({
      db: sequelize,
      table: 'Session',
   }),
  }));
  app.use(passport.initialize());
  app.use(passport.session());


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
