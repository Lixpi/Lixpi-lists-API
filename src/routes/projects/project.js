'use strict'

const authMiddleware = require('../../middleware/auth')
const { Project } = require('../../project/model')

module.exports.get = async (req, res) => {
    authMiddleware(req, res)

    await Project.findByKey(req.params.key.toUpperCase()).then(project => {
        res.status(200).json(project)
    })
}
