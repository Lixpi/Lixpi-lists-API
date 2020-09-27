'use strict'

const authMiddleware = require('../../middleware/auth')
const { Status } = require('../../status/model')

const post = async (req, res) => {
    authMiddleware(req, res)

    const newStatusData = {
        title: req.body.title
    }
    const status = await Status.create(newStatusData)
    res.status(200).json(status)
}

const get = async (req, res) => {
    authMiddleware(req, res)

    const statuses = await Status.getAll()
    res.status(200).json(statuses)
}

module.exports = {
    get,
    post
}
