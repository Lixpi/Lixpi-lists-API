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
    const {
        title,
        description,
        version,
        timeEstimated,
        timeSpent,
        dueAt,
        authorId,
        labels,
        type,
        status,
        priority,
        assignees
    } = data
    const newKey = 'KEY-1'


    const userRoles = await Promise.all(
        assignees.map(assignee =>
            getUserByUsername(assignee.username)
                .then(user => user.addRole(assignee.role))
        )
    )


    return Task.create({
        key: newKey,
        title,
        description,
        version,
        timeEstimated,
        timeSpent,
        dueAt,
        authorId
    })
    .then((task) => {
        // task.addLabels(labels)
        // task.addType(type)
        // task.addStatus(status)
        // task.addPriority(priority)

        userRoles.forEach(userRole => task.addUserRoles(userRole))

        return task
    })
}

module.exports = {
    createTask,
    getTask,
    getTasks
}
