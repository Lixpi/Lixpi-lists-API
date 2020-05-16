'use strict'

const passport = require('passport')

// TODO: just an ugly prototype, remove soon
module.exports = async function authMiddleware(req, res) {
    if (!req.isAuthenticated()) {
        res.status(401).json({ result: 'Unauthenticated' })
    }
}

/**
* Authenticate with passport.
* @param {Object} req
* @param {Object} res
* @param {Function} next
*/
const authenticate = (req, res, next) => new Promise((resolve, reject) => {
    passport.authenticate('local', (err, user) => {
        if (err) {
            return reject(err)
        }

        return resolve(user)
    })(req, res, next)
})


/**
* Login
* @param {Object} req
* @param {Object} user
*/
const login = (req, user) => new Promise((resolve, reject) => {
    req.login(user, (err) => {
        if (err) {
            return reject(err)
        }

        return resolve()
    })
})

/**
 * Regenerate user session.
 * @param {Object} req
 */
const regenerateSession = req => new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
        if (err) {
            return reject(err)
        }

        return resolve()
    })
})

/**
 * Save user session.
 * @param {Object} req
 */
const saveSession = req => new Promise((resolve, reject) => {
    req.session.save((err) => {
        if (err) {
            return reject(err)
        }

        return resolve()
    })
})

module.exports.authenticateWithSession = (req, res, next) => new Promise(async (resolve, reject) => {
    const user = await authenticate(req, res, next)

    if (!user) {
        return reject('Invalid credentials.')
    }

    await login(req, user)
    const temp = req.session.passport

    await regenerateSession(req)
    req.session.passport = temp

    await saveSession(req)

    return resolve('You were authenticated & logged in.')
})
