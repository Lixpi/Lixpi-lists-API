'use strict'

const authMiddleware = require('../../middleware/auth')
const { Priority } = require('../../models/priority')

const post = async (req, res) => {
    authMiddleware(req, res)

    const newPriorityData = {
        title: req.body.title
    }
    const priority = await Priority.create(newPriorityData)
    res.status(200).json(priority)
}

const get = async (req, res) => {
    authMiddleware(req, res)

    const priorities = await Priority.getAll()
    res.status(200).json(priorities)
}

module.exports = {
    get,
    post
}
