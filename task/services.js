'use strict'

const Task = require('./model')

const getTask = async function getTask (key) {
    const task = await Task.findOne({key})
        .populate('author')
        .exec()
    return task
}

const getTasks = async function getTasks () {
    const tasks = await Task.find()
        .populate('author')
        .exec()
    return tasks
}

const createTask = async function createTask (newTaskData, currentTimestamp = new Date().getTime()) {
    const newKey = 'KEY-1'
    const mergedTaskData = Object.assign({},
        { key: newKey },
        newTaskData,
        {
            timestamps: {
                createdAt: currentTimestamp,
                updatedAt: currentTimestamp
            }
        }
    )
    const task = await new Task(mergedTaskData).save()
    return await Task.populate(task, { path: 'author' })
}

module.exports = {
    createTask,
    getTask,
    getTasks
}
