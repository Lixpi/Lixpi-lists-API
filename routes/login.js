'use strict';

const User = require("../users/model")

module.exports.post = (req, res) => {
    User.authenticate()(req.body.username, req.body.password, function(err, result) {
        if (!result) {
            res.status(401).json({
                error: {
                    code: 401,
                    message: 'Invalid credentials!'
                }
            })
        }
        req.login(result, (err) => {
            res.status(200).json({
                success: {
                    code: 200,
                    message: 'You were authenticated & logged in!'
                }
            })
        })
    });
}
