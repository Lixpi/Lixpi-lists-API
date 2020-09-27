'use strict'

const authMiddleware = require('../../middleware/auth')
const { Type } = require('../../type/model')

const get = async (req, res) => {
    authMiddleware(req, res)

    await Type.findById(req.params.id.toUpperCase()).then(type => {
        res.status(200).json(type)
    })
}

const del = async (req, res) => {
    authMiddleware(req, res)
    
    await Type.delete(req.params.id)

    res.status(200).json(
        'Type is deleted.'
    )
}

module.exports = {
    get,
    del
}
