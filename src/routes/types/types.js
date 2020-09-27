'use strict'

const authMiddleware = require('../../middleware/auth')
const { Type } = require('../../type/model')

const post = async (req, res) => {
    authMiddleware(req, res)

    const newTypeData = {
        title: req.body.title
    }
    const type = await Type.create(newTypeData)
    res.status(200).json(type)
}

const get = async (req, res) => {
    authMiddleware(req, res)

    const types = await Type.getAll()
    res.status(200).json(types)
}

module.exports = {
    get,
    post
}
