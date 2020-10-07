'use strict'

const authMiddleware = require('../../middleware/auth')
const { Priority } = require('../../models/priority')

const get = async (req, res) => {
    authMiddleware(req, res)

    await Priority.findById(req.params.id.toUpperCase()).then(priority => {
        res.status(200).json(priority)
    })
}

const del = async (req, res) => {
    authMiddleware(req, res)

    await Priority.delete(req.params.id)

    res.status(200).json('Priority is deleted.')
}

module.exports = {
    get,
    del
}
