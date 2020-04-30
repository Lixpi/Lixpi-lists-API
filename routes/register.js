'use strict';

const Bluebird = require('bluebird');
const { User } = require("../users/model")

module.exports.post = async (req, res) => {


    await User.create({ name: req.body.username, email: req.body.username, password: req.body.password })
        .then(() => {
            return res.send('User is created');
        })
        .catch((err) => {
            return res.json(err)
        })


    // User.save({username: req.body.username, active: false}, req.body.password, function(err, user) {
    //     if (err) {
    //         res.json({
    //             success: false,
    //             message: "Your account could not be saved. Error: ",
    //             err
    //         })
    //     }
    //     // User.authenticate()(req.body.username, req.body.password, function(err, result) {
    //     //     if (!result) {
    //     //         res.send('Something is wrong')
    //     //     }
    //     //     req.login(result, (err) => {
    //     //         return res.send('You were authenticated & logged in!');
    //     //     })
    //     // });
    // });
}