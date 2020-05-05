'use strict'

const { authenticate, login, regenerateSession, saveSession } = require("../middleware/auth")

module.exports.post = async (req, res, next) => {

    const user = await authenticate(req, res, next)

    if (!user) {
        return res.status(401).json({
            error: {
                code: 401,
                message: 'Invalid credentials!'
            }
        })
    }

    await login(req, user)
    const temp = req.session.passport

    await regenerateSession(req)
    req.session.passport = temp

    await saveSession(req)

    return res.status(200).json({
        success: {
            code: 200,
            message: 'You were authenticated & logged in!'
        }
    })
}
