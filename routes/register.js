'use strict';

const User = require("../users/model")

module.exports.post = (req, res) => {
    User.register({username: req.body.username, active: false}, req.body.password, function(err, user) {
        if (err) {
            res.json({
                success: false,
                message: "Your account could not be saved. Error: ",
                err
            })
        }
        User.authenticate()(req.body.username, req.body.password, function(err, result) {
            if (!result) {
                res.send('Something is wrong')
            }
            req.login(result, (err) => {
                return res.send('You were authenticated & logged in!');
            })
        });
    });
}