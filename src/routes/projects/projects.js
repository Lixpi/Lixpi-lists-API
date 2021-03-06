'use strict'

const authMiddleware = require('../../middleware/auth')
const { Project } = require('../../models/project')

const post = async (req, res) => {
    authMiddleware(req, res)

    const newProjectData = {
        title: req.body.title,
        description: req.body.description
    }
    const project = await Project.create(newProjectData)
    res.status(200).json(project)
}

const get = async (req, res) => {
    authMiddleware(req, res)

    const projects = await Project.getAll()
    res.status(200).json(projects)
}

module.exports = {
    get,
    post
}
