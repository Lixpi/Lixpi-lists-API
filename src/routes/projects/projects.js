'use strict'

const authMiddleware = require('../../middleware/auth')
const { Project } = require('../../project/model')

module.exports.post = async (req, res) => {
    authMiddleware(req, res)

    const newProjectData = {
        title: req.body.title,
        description: req.body.description
    }
    const project = await Project.create(newProjectData).then(project => {
        res.status(200).json(project)
    })
}
