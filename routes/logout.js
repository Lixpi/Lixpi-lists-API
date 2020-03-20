'use strict';

module.exports.get = (req, res) => {
    req.logout()
    req.session.destroy()
    res.status(401).json({result: 'Logged out!'})
}
