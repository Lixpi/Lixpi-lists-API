'use strict'

const sequelize = require('../db/sequelize')
const { getUserByUsername } = require('../user/repository')
const { Task, TaskAssignee, UserRole } = require('./model')
const { User } = require('../user/model')

const getTask = async key => {
    const task = await Task.findOne({key})
        .populate('author')
        .exec()
    return task
}

const getTasks = async () => {
    return Task.findAll({
        include: [
        {
            model: User,
            as: 'author',
            attributes: ['id', 'username']
        },
        {
            model: TaskAssignee,
            attributes: ['id'],
            include: [{
                model: UserRole,
                attributes: ['RoleTitle'],
                include: [{
                    model: User,
                    attributes: ['id', 'username']
                }]
            }],
        }]
    }).then(tasks => tasks.map(task => ({
        key: task.key,
        title: task.title,
        description: task.description,
        version: task.version,
        timeEstimated: task.timeEstimated,
        timeSpent: task.timeSpent,
        dueAt: task.dueAt,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        author: task.author.dataValues,
        taskAssignees: task.TaskAssignees.map(taskAssignee => ({
            userId: taskAssignee.dataValues.UserRole.User.dataValues.id,
            username: taskAssignee.dataValues.UserRole.User.dataValues.username,
            role: taskAssignee.dataValues.UserRole.dataValues.RoleTitle
        }))
    })))
}

const createTask = async data => {
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
