'use strict'

const authMiddleware = require('../../middleware/auth')
const { Version } = require('../../models/version')

const post = async (req, res) => {
    authMiddleware(req, res)

    const newVersionData = {
        title: req.body.title
    }
    const version = await Version.create(newVersionData)
    res.status(200).json(version)
}

const get = async (req, res) => {
    authMiddleware(req, res)

    const labels = await Version.getAll()
    res.status(200).json(labels)
}

module.exports = {
    get,
    post
}
