'use strict'

const authMiddleware = require('../../middleware/auth')
const { Task } = require('../../task/model')

const get = async (req, res) => {
    authMiddleware(req, res)
    const task = await Task.findByKey(req.params.key)
    res.status(200).json(task)
}

const del = async (req, res) => {
    authMiddleware(req, res)
    await Task.delete(req.params.id)
    res.status(200).json(
        'Task is deleted.'
    )
}

module.exports = {
    get,
    del
}
