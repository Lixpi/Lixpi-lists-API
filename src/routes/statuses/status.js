'use strict'

const authMiddleware = require('../../middleware/auth')
const { Status } = require('../../status/model')

const get = async (req, res) => {
    authMiddleware(req, res)

    await Status.findById(req.params.id.toUpperCase()).then(status => {
        res.status(200).json(status)
    })
}

const del = async (req, res) => {
    authMiddleware(req, res)

    await Status.delete(req.params.id)

    res.status(200).json(
        'Status is deleted.'
    )
}

module.exports = {
    get,
    del
}
