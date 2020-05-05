const Bluebird = require('bluebird');
const express = require('express')
const session = require('express-session')
const cors = require('cors')
const uuid = require('uuid/v4')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// const mongoose = require('mongoose')
const { Sequelize } = require('sequelize');
const sequelize = require('./db/sequelize-singleton');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// const MongoStore = require('connect-mongo')(session)


const userQueries = require('./users/services');

const indexRoute = require('./routes/index')
const tasksRoute = require('./routes/tasks/tasks')
const taskRoute = require('./routes/tasks/task')
const loginRoute = require('./routes/login')
const logoutRoute = require('./routes/logout')
const testAuthRoute = require('./routes/testauth')
const registerRoute = require('./routes/register')


// const sessionStore = new MongoStore({
//     host: 'mongodb',
//     port: '27017',
//     db: 'lists',
//     url: 'mongodb://mongodb:27017/lists'
// });

// create the server
const app = express();

// mongoose.connect('mongodb://mongodb/lists', { useNewUrlParser: true })

// add & configure middleware
app.use(express.json());

// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
// }));


// app.use(
//     session({
//         genid: (req) => {
//             return uuid() // use UUIDs for session IDs
//         },
//         store: sessionStore,
//         secret: 'keyboard cat',
//         resave: false,
//         saveUninitialized: true
//     })
// )

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


// TODO temporary db init
const { User } = require("./users/model");
const { Session } = require("./session/model");
(async () => {
  await User.sync({ alter: true })
  await Session.sync({ alter: true })
})
// () // Uncomment to call init db func


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
