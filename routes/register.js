'use strict';

const { User } = require("../user/model")
const { authenticateWithSession } = require("../middleware/auth")

module.exports.post = async (req, res, next) => {
    await User.create({ username: req.body.username, password: req.body.password })
        .then(async () => {
            await authenticateWithSession(req, res, next)
                .then((message) => {
                    return res.status(200).json({
                        success: {
                            code: 200,
                            message
                        }
                    })
                })
                .catch((message) => {
                    return res.status(401).json({
                        error: {
                            code: 401,
                            message
                        }
                    })
                })
        })
        .catch((err) => {
            return res.json({
                success: false,
                message: "Your account could not be saved. Error: ",
                err
            })
        })
}
