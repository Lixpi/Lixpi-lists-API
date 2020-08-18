// 'use strict'

// const { QueryTypes } = require('sequelize')

// const sequelize = require('../db/sequelize')
// // const { getUserByUsername } = require('../user/repository')
// const { Task, TaskAssignee, UserRole } = require('./model')
// const { User } = require('../user/model')

// const getTask = async key => {
//     const task = await Task.findOne({key})
//         .populate('author')
//         .exec()
//     return task
// }

// const getTasks = async () => {
//     return Task.findAll({
//         attributes: ['key', 'title', 'dueAt'],
//         include: [{
//             model: TaskAssignee,
//             attributes: ['id'],
//             include: [{
//                 model: UserRole,
//                 attributes: ['RoleId'],
//                 include: [{
//                     model: User,
//                     attributes: ['id', 'username']
//                 }]
//             }],
//         }]
//     }).then(tasks => {
//         return tasks.map(task => ({
//             key: task.key,
//             title: task.title,
//             dueAt: task.dueAt,
//             taskAssignees: task.TaskAssignees.map(taskAssignee => ({
//                 userId: taskAssignee.dataValues.UserRole.User.dataValues.id,
//                 username: taskAssignee.dataValues.UserRole.User.dataValues.username,
//                 role: taskAssignee.dataValues.UserRole.dataValues.RoleId
//             }))
//         }))
//     })
// }

// const createTask = async data => {
//     const {
//         projectKey,
//         title,
//         description,
//         version,
//         timeEstimated,
//         timeSpent,
//         dueAt,
//         authorId,
//         labels,
//         type,
//         status,
//         priority,
//         assignees
//     } = data

//     const results = await sequelize.query('SELECT generate_next_seq_val(?, ?)', {
//         replacements: [projectKey, 'project_' + projectKey.toLowerCase()],
//         type: QueryTypes.SELECT
//     })
//     const newKey = results[0].generate_next_seq_val


//     const userRoles = await Promise.all(
//         // assignees.map(assignee =>
//         //     getUserByUsername(assignee.username)
//         //         .then(user => user.addRole(assignee.role))
//         // )
//     )

//     try {
//         return await sequelize.transaction(async (t) => {
//             const task = await Task.create({
//                 key: newKey,
//                 title,
//                 description,
//                 version,
//                 timeEstimated,
//                 timeSpent,
//                 dueAt,
//                 authorId,
//                 projectKey
//             }, { transaction: t })

//             await Promise.all([
//                 ...userRoles.map(userRole => task.addUserRoles(userRole, { transaction: t })),
//                 task.addLabels(labels, { transaction: t }),
//                 task.addType(type, { transaction: t }),
//                 task.addStatus(status, { transaction: t }),
//                 task.addPriority(priority, { transaction: t })
//             ])

//             return task
//         })
//     } catch (error) {
//         console.log(error)
//     }
// }

// module.exports = {
//     createTask,
//     getTask,
//     getTasks
// }
