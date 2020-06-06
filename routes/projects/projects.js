'use strict'

const authMiddleware = require('../../middleware/auth')
const { createProject } = require('../../project/repository')

module.exports.post = async (req, res) => {
    authMiddleware(req, res)
    const newProjectData = {
        title: req.body.title,
        description: req.body.description
    }
    const project = await createProject(newProjectData)
    res.status(200).json(project)
}
