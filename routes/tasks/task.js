'use strict';

const authMiddleware = require("../../middleware/auth")
const { getTask } = require("../../tasks/services")

module.exports.get = async (req, res) => {
    authMiddleware(req, res)
    const task = await getTask(req.params.key)
    res.status(200).json(task)
}
