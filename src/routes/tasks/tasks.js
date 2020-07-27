'use strict'

const authMiddleware = require('../../middleware/auth')
const { Task } = require('../../task/model')

module.exports.get = async (req, res) => {
    authMiddleware(req, res)
    // const tasks = await getTasks()
    // res.status(200).json(tasks)
}

module.exports.post = async (req, res) => {
    authMiddleware(req, res)
    const newTaskData = {
        projectKey: req.body.projectKey,
        title: req.body.title,
        description: req.body.description,
        version: req.body.version,
        timeEstimated: req.body.timeEstimated,
        timeSpent: req.body.timeSpent,
        dueAt: req.body.dueAt,
        authorId: req.user.id,
        assignees: req.body.assignees,
        labels: req.body.labels,
        type: req.body.type,
        status: req.body.status,
        priority: req.body.priority
    }
    const task = await Task.create(newTaskData)
    res.status(200).json(task)
}
