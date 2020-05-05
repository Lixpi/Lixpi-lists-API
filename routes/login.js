'use strict';

// const User = require("../users/model")
const { authenticate, login } = require("../middleware/auth")

const Bluebird = require('bluebird');
const passport = require('passport');


module.exports.post = async (req, res, next) => {

    const user = await authenticate(req, res, next);
    console.log('user!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log(user)

    if (!user) {
        return res.status(401).send('Invalid email or password');
    }

    await login(req, user);
    // const temp = req.session.passport;

    // await regenerateSession(req);
    // req.session.passport = temp;

    // await saveSession(req);

    // return res.send();






    // User.authenticate()(req.body.username, req.body.password, function(err, result) {
    //     if (!result) {
    //         res.status(401).json({
    //             error: {
    //                 code: 401,
    //                 message: 'Invalid credentials!'
    //             }
    //         })
    //     }
    //     req.login(result, (err) => {
    //         res.status(200).json({
    //             success: {
    //                 code: 200,
    //                 message: 'You were authenticated & logged in!'
    //             }
    //         })
    //     })
    // });
}
