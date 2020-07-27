'use strict'

const { knex } = require('../db/knex')

class Task {
    static tableName = 'tasks'

    constructor(values = {}) {
        Object.assign(this, values)
    }

    static init(values) {
        return new this(values)
    }

    static async findById(id) {
        const values =  await knex(this.tableName).where({ id }).first()
        return this.init(values)
    }

    static async findByKey(key) {
        const values =  await knex(this.tableName).where({ key }).first()
        return this.init(values)
    }

    static async create(values) {
        const {
            projectKey,
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
        } = values

        // const newKey = await knex.raw('SELECT project_generate_next_sequence_val_procedure(?)', [projectKey]).then((result) => result.rows[0].project_generate_next_sequence_val_procedure)
        // console.log('newKey')
        // console.log(newKey)

        const newKeyResponse = await knex.raw('SELECT project_generate_next_sequence_val_procedure(?)', [projectKey])
        const newKey = newKeyResponse.rows[0].project_generate_next_sequence_val_procedure
        console.log('newKey')
        console.log(newKey)


        // let { key, title, description } = values
        // const projectKey = key || title.slice(0, 3).toUpperCase()
        // const sequenceName = `project_${projectKey}`
        // let createdTask = {}

        let createdTask = await knex(this.tableName)
            .returning(['id', 'key', 'title', 'description', 'version', 'time_estimated', 'time_spent', 'due_at', 'created_at', 'updated_at'])
            .insert({
                key: newKey,
                title,
                description,
                version,
                time_estimated: timeEstimated,
                time_spent: timeSpent,
                due_at: dueAt,
                // author_id: authorId,
                // project_key: projectKey
            })
            // .then((project) => {
            //     createdTask = this.init(project[0])
            //     return knex.raw('CREATE SEQUENCE ' + sequenceName)
            // })
            // .then(() => {
            //     return knex(this.sequencesTableName).insert({projectKey, nextValue: 1})
            // })

        console.log('createdTask')
        console.log(createdTask)
        return createdTask


        // try {
        //     return await sequelize.transaction(async (t) => {
        //         const task = await Task.create({
        //             key: newKey,
        //             title,
        //             description,
        //             version,
        //             timeEstimated,
        //             timeSpent,
        //             dueAt,
        //             authorId,
        //             projectKey
        //         }, { transaction: t })

        //         await Promise.all([
        //             ...userRoles.map(userRole => task.addUserRoles(userRole, { transaction: t })),
        //             task.addLabels(labels, { transaction: t }),
        //             task.addType(type, { transaction: t }),
        //             task.addStatus(status, { transaction: t }),
        //             task.addPriority(priority, { transaction: t })
        //         ])

        //         return task
        //     })
        // } catch (error) {
        //     console.log(error)
        // }



    }
}

// // TODO: add afterDestroy hook and drop all sequences

module.exports = { Task }




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




// 'use strict'

// const Sequelize = require('sequelize')

// const sequelize = require('../db/sequelize')
// // const { Project } = require('../project/model')
// // const { User } = require('../user/model')
// const { Role } = require('../role/model')
// const { Label } = require('../label/model')
// const { Type } = require('./type/model')
// const { Status } = require('./status/model')
// const { Priority } = require('./priority/model')

// const { TEXT, INTEGER, DATE } = Sequelize

// const mappings = {
//     key: {
//         type: TEXT,
//         primaryKey: true,
//         allowNull: false
//     },
//     title: {
//         type: TEXT,
//         allowNull: false
//     },
//     description: {
//         type: TEXT,
//         allowNull: true
//     },
//     version: {
//         type: TEXT,
//         allowNull: true
//     },
//     timeEstimated: {
//         type: INTEGER,
//         allowNull: true
//     },
//     timeSpent: {
//         type: INTEGER,
//         allowNull: true
//     },
//     dueAt: {
//         type: DATE,
//         allowNull: true
//     }
// }

// const Task = sequelize.define('Task', mappings, {
//     indexes: [{
//         name: 'task_title_index',
//         method: 'BTREE',
//         fields: ['title'],
//     }],
//     underscored: true
// })

// // Adding projectKey to Task model
// // Task.belongsTo(Project, { as: 'project' })

// // // Adding authorId to Task model
// // Task.belongsTo(User, { as: 'author' })

// // // Adding task assignees using two tables <UserRole> and <TaskAssignee>
// // const UserRole = sequelize.define('UserRole', {
// //     id: {
// //         type: INTEGER,
// //         primaryKey: true,
// //         autoIncrement: true,
// //         allowNull: false
// //     }
// // }, { timestamps: false, underscored: true })

// // User.belongsToMany(Role, { through: UserRole })
// // User.hasMany(UserRole)
// // Role.belongsToMany(User, { through: UserRole })
// // Role.hasMany(UserRole)
// // UserRole.belongsTo(User)
// // UserRole.belongsTo(Role)

// // const TaskAssignee = sequelize.define('TaskAssignee', {
// //     id: {
// //         type: INTEGER,
// //         primaryKey: true,
// //         autoIncrement: true,
// //         allowNull: false
// //     }
// // }, { timestamps: false, underscored: true })

// // Task.belongsToMany(UserRole, { through: TaskAssignee })
// // Task.hasMany(TaskAssignee)
// // UserRole.belongsToMany(Task, { through: TaskAssignee })
// // UserRole.hasMany(TaskAssignee)
// // TaskAssignee.belongsTo(Task)
// // TaskAssignee.belongsTo(UserRole)

// // Adding labels to task
// const TaskLabel = sequelize.define('TaskLabel', {
//     id: {
//         type: INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//     }
// }, { timestamps: false, underscored: true })

// Task.belongsToMany(Label, { through: TaskLabel })
// Task.hasMany(TaskLabel)
// Label.belongsToMany(Task, { through: TaskLabel })
// Label.hasMany(TaskLabel)
// TaskLabel.belongsTo(Task)
// TaskLabel.belongsTo(Label)

// // Adding types to task
// const TaskType = sequelize.define('TaskType', {
//     id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//     }
// }, { timestamps: false, underscored: true })

// Task.belongsToMany(Type, { through: TaskType })
// Type.belongsToMany(Task, { through: TaskType })
// TaskType.belongsTo(Task)
// Type.hasMany(TaskType)
// Task.hasMany(TaskType)
// TaskType.belongsTo(Type)

// // Adding status to task
// const TaskStatus = sequelize.define('TaskStatus', {
//     id: {
//         type: INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//     }
// }, { timestamps: false, underscored: true })

// Task.belongsToMany(Status, { through: TaskStatus })
// Status.belongsToMany(Task, { through: TaskStatus })
// Task.hasMany(TaskStatus)
// TaskStatus.belongsTo(Task)
// Status.hasMany(TaskStatus)
// TaskStatus.belongsTo(Status)

// // Adding priority to task
// const TaskPriority = sequelize.define('TaskPriority', {
//     id: {
//         type: INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//     }
// }, { timestamps: false, underscored: true })

// Task.belongsToMany(Priority, { through: TaskPriority })
// Priority.belongsToMany(Task, { through: TaskPriority })
// Task.hasMany(TaskPriority)
// TaskPriority.belongsTo(Task)
// Priority.hasMany(TaskPriority)
// TaskPriority.belongsTo(Priority)

// // exports.UserRole = UserRole
// // exports.TaskAssignee = TaskAssignee
// exports.TaskLabel = TaskLabel
// exports.TaskType = TaskType
// exports.TaskStatus = TaskStatus
// exports.TaskPriority = TaskPriority
// exports.Task = Task
