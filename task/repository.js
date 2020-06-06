'use strict'

const sequelize = require('../db/sequelize')
const { getUserByUsername } = require('../user/repository')
const { Task, TaskAssignee, UserRole } = require('./model')
const { User } = require('../user/model')

const getTask = async function getTask (key) {
    const task = await Task.findOne({key})
        .populate('author')
        .exec()
    return task
}

const getTasks = async function getTasks () {
    return Task.findAll({
        include: [{
            model: TaskAssignee,
            attributes: ['id'],
            include: [{
                model: UserRole,
                attributes: ['RoleTitle'],
                include: [{
                    model: User,
                    attributes: ['username']
                }]
            }],
        }]
    }).then(tasks => {
        console.log('tasks')
        console.log(tasks)
        return tasks.map(task => {
            return {
                key: task.key,
                title: task.title
            }
        })
    })
}

const createTask = async function createTask (data) {
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

            await Promise.all([
                ...userRoles.map(userRole => task.addUserRoles(userRole, { transaction: t })),
                task.addLabels(labels, { transaction: t }),
                task.addType(type, { transaction: t }),
                task.addStatus(status, { transaction: t }),
                task.addPriority(priority, { transaction: t })
            ])

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
