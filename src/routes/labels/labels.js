'use strict'

const authMiddleware = require('../../middleware/auth')
const { Label } = require('../../models/label')

const post = async (req, res) => {
    authMiddleware(req, res)

    const newLabelData = {
        title: req.body.title
    }
    const label = await Label.create(newLabelData)
    res.status(200).json(label)
}

const get = async (req, res) => {
    authMiddleware(req, res)

    const labels = await Label.getAll()
    res.status(200).json(labels)
}

module.exports = {
    get,
    post
}
