'use strict'

const sequelize = require('../db/sequelize-singleton')()
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

    try {
        return await sequelize.transaction(async (t) => {
            const task = await Task.create({
                key: newKey,
                title,
                description,
                version,
                timeEstimated,
                timeSpent,
                dueAt,
                authorId
            }, { transaction: t })

            await Promise.all(
                userRoles.map(userRole => task.addUserRoles(userRole, { transaction: t }))
            )

            return task
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    createTask,
    getTask,
    getTasks
}
