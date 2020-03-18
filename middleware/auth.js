'use strict';

// TODO: just an ugly prototype
module.exports = async function authMiddleware (req, res) {
    if (!req.isAuthenticated()) {
        res.status(401).json({result: 'Unauthenticated'})
    }
};
