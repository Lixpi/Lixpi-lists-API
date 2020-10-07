'use strict'

const authMiddleware = require('../../middleware/auth')
const { User } = require('../../models/user')

const post = async (req, res) => {
    authMiddleware(req, res)

    const newUserData = {
        title: req.body.title
    }
    const user = await User.create(newUserData)
    res.status(200).json(user)
}

const get = async (req, res) => {
    authMiddleware(req, res)

    const users = await User.getAll()
    res.status(200).json(users)
}

module.exports = {
    get,
    post
}
