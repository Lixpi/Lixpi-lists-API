'use strict'

const authMiddleware = require('../../middleware/auth')
const { User } = require('../../models/user')

const get = async (req, res) => {
    authMiddleware(req, res)

    await User.findById(req.params.id.toUpperCase()).then(user => {
        res.status(200).json(user)
    })
}

const del = async (req, res) => {
    authMiddleware(req, res)

    await User.delete(req.params.id)

    res.status(200).json('User is deleted.')
}

module.exports = {
    get,
    del
}
