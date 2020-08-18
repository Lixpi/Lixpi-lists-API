'use strict'

const authMiddleware = require('../../middleware/auth')
const { Task } = require('../../task/model')

module.exports.get = async (req, res) => {
    authMiddleware(req, res)
    const task = await Task.findByKey(req.params.key)
    res.status(200).json(task)
}
