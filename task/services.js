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
    const newKey = 'KEY-37'

    const assigneeRecords = []
    for (const assignee of assignees) {
        const assigneeUser = await getUserByUsername(assignee[0])
        const assigneeRecord = await assigneeUser.addRole(assignee[1])
        assigneeRecords.push(assigneeRecord)
    }

    Promise.all(
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
    )
        .then((task) => {
            // task.addLabels(labels)
            // task.addType(type)
            // task.addStatus(status)
            // task.addPriority(priority)
            
            for (const assignee of assigneeRecords) {
                task.addUserRoles(assignee)
            }
        })
}

module.exports = {
    createTask,
    getTask,
    getTasks
}
