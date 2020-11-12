'use strict'

const authMiddleware = require('../../middleware/auth')
const { Task } = require('../../models/task')

const get = async (req, res) => {
    authMiddleware(req, res)
    const task = await Task.findByKey(req.params.key)
    res.status(200).json(task)
}

const put = async (req, res) => {
    authMiddleware(req, res)
    const updatedTaskData = {
        key: req.body.key,
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
    const task = await Task.update(updatedTaskData)
    res.status(200).json(task)
}

const del = async (req, res) => {
    authMiddleware(req, res)
    await Task.delete(req.params.id)
    res.status(200).json('Task is deleted.')
}

module.exports = {
    get,
    put,
    del
}
