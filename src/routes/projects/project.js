'use strict'

const authMiddleware = require('../../middleware/auth')
const { Project } = require('../../models/project')

const get = async (req, res) => {
    authMiddleware(req, res)

    await Project.findByKey(req.params.key.toUpperCase()).then(project => {
        res.status(200).json(project)
    })
}

const del = async (req, res) => {
    authMiddleware(req, res)

    await Project.delete(req.params.id)

    res.status(200).json('Project is deleted.')
}

module.exports = {
    get,
    del
}
