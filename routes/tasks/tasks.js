'use strict'

const authMiddleware = require('../../middleware/auth')
const { getTasks, createTask } = require('../../task/services')

module.exports.get = async (req, res) => {
    authMiddleware(req, res)
    const tasks = await getTasks()
    res.status(200).json(tasks)
}

module.exports.post = async (req, res) => {
    authMiddleware(req, res)
    const newTaskData = {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        status: req.body.status,
        priority: req.body.priority,
        version: req.body.version,
        labels: req.body.labels,
        author: req.user._id,
        timeTracking: req.body.timeTracking,
        dueAt: req.body.dueAt
    }
    const task = await createTask(newTaskData)
    res.status(200).json(task)
}
