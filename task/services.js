'use strict'

const { getUserByUsername } = require('../user/services')
const { Task, TaskLabel } = require('./model')
const { Label } = require('../label/model')

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

const createTask = async function createTask (data, currentTimestamp = new Date().getTime()) {
    const newKey = 'KEY-25'
    const nargiza = await getUserByUsername('nargiza')
    const nargiza1 = await getUserByUsername('nargiza1')

    const {title, description, version, timeEstimated, timeSpent, dueAt, authorId, labels, type, status, priority, assignees} = data
    Promise.all([
        Task.create({ 
            key: newKey,
            title, 
            description,
            version,
            timeEstimated,
            timeSpent,
            dueAt,
            authorId
        })
    ])
        .then(([task]) => {
            // task.addLabels(labels)
            // task.addType(type)
            // task.addStatus(status)
            // task.addPriority(priority)
            // const assignee = nargiza.addRole(assignees[0][1])
            // task.addUserRoles(assignee.id)
        })
}

module.exports = {
    createTask,
    getTask,
    getTasks
}
