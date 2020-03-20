'use strict';

module.exports.get = (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({result: 'Authenticated'})
    } else {
        res.status(401).json({result: 'Unauthenticated'})
    }
}
