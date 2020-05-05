'use strict';

/**
 * HTTP handler for sign out.
 *
 * @param {Object} req
 * @param {Object} res
 */
module.exports.get = (req, res) => {
    req.logout();
    req.session.destroy()
    res.status(401).json({ result: 'Logged out!' })
}
