'use strict';

const Task = require('./model');
const User = require('../users/model')

module.exports = async function getTask (key) {
    const task = await Task.findOne({key}).exec()
    const user = await User.findById(task.author).exec()
    task.author = user
    return task
};
