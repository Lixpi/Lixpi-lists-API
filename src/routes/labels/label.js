'use strict'

const authMiddleware = require('../../middleware/auth')
const { Label } = require('../../models/label')

const get = async (req, res) => {
    authMiddleware(req, res)

    await Label.findById(req.params.id.toUpperCase()).then(label => {
        res.status(200).json(label)
    })
}

const del = async (req, res) => {
    authMiddleware(req, res)

    await Label.delete(req.params.id)

    res.status(200).json(
        'Label is deleted.'
    )
}

module.exports = {
    get,
    del
}
