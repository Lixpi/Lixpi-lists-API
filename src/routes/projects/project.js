'use strict'

const authMiddleware = require('../../middleware/auth')
const { Project } = require('../../models/project')

module.exports.get = async (req, res) => {
    authMiddleware(req, res)

    await Project.findByKey(req.params.key.toUpperCase()).then(project => {
        res.status(200).json(project)
    })
}
