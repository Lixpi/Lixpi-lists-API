'use strict';

const passport = require('passport');

// TODO: just an ugly prototype, remove soon
module.exports = async function authMiddleware (req, res) {
    if (!req.isAuthenticated()) {
        res.status(401).json({result: 'Unauthenticated'})
    }
};


/**
* Authenticate with passport.
* @param {Object} req
* @param {Object} res
* @param {Function} next
*/
module.exports.authenticate = (req, res, next) => new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user) => {
      if (err) {
        return reject(err);
      }

      return resolve(user);
    })(req, res, next);
  });


/**
* Login
* @param {Object} req
* @param {Object} user
*/
module.exports.login = (req, user) => new Promise((resolve, reject) => {
    req.login(user, (err) => {
        if (err) {
            return reject(err);
        }

        return resolve();
    });
});

  /**
   * Regenerate user session.
   * @param {Object} req
   */
  module.exports.regenerateSession = req => new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });

  /**
   * Save user session.
   * @param {Object} req
   */
  module.exports.saveSession = req => new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });