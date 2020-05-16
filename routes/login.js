'use strict'

const { authenticateWithSession } = require('../middleware/auth')

module.exports.post = async (req, res, next) => {
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
}


