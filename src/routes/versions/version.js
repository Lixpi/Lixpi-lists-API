'use strict'

const authMiddleware = require('../../middleware/auth')
const { Version } = require('../../models/version')

const get = async (req, res) => {
    authMiddleware(req, res)

    await Version.findById(req.params.id.toUpperCase()).then(version => {
        res.status(200).json(version)
    })
}

const del = async (req, res) => {
    authMiddleware(req, res)

    await Version.delete(req.params.id)

    res.status(200).json(
        'Version is deleted.'
    )
}

module.exports = {
    get,
    del
}
