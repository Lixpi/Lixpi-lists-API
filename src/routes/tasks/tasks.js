'use strict'

const authMiddleware = require('../../middleware/auth')
const { Task } = require('../../models/task')

const get = async (req, res) => {
    authMiddleware(req, res)
    const tasks = await Task.getAll()
    res.status(200).json(tasks)
}

const post = async (req, res) => {
    authMiddleware(req, res)
    const newTaskData = {
        projectId: req.body.projectId,
        title: req.body.title,
        description: req.body.description,
        version: req.body.version,
        timeEstimated: req.body.timeEstimated,
        timeSpent: req.body.timeSpent,
        dueAt: req.body.dueAt,
        authorId: req.user.id,
        type: req.body.type,
        status: req.body.status,
        priority: req.body.priority,
        labels: req.body.labels,
        versions: req.body.versions,
        assignees: req.body.assignees
    }
    const task = await Task.create(newTaskData)
    res.status(200).json(task)
}

module.exports = {
    get,
    post
}
