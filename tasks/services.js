'use strict';

const Task = require('./model');

const getTask = async function getTask (key) {
    const task = await Task.findOne({key}).
    populate('author').
    exec()
    return task
};

const getTasks = async function getTasks () {
    const tasks = await Task.find().
    populate('author').
    exec()
    return tasks
};

module.exports = {
    getTask,
    getTasks
}
