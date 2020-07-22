'use strict'

const { authenticateWithSession } = require('../middleware/auth')

module.exports.post = async (req, res, next) => {
    await authenticateWithSession(req, res, next)
        .then((message) => {
            console.log('then')
            return res.status(200).json({
                success: {
                    code: 200,
                    message
                }
            })
        })
        .catch((message) => {
            console.log('catch')
            return res.status(401).json({
                error: {
                    code: 401,
                    message
                }
            })
        })
}


