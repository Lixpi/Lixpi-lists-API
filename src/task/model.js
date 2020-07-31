'use strict'

const { knex } = require('../db/knex')

class Task {
    static tableName = 'tasks'
    static labelsTableName = 'task_labels'
    static assigneesTableName = 'task_assignees'

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
            projectId,
            title,
            description,
            version,
            timeEstimated,
            timeSpent,
            dueAt,
            authorId,
            typeId,
            statusId,
            priorityId,
            labelIds,
            assignees
        } = values

        const newKeyResponse = await knex.raw('SELECT project_generate_next_sequence_val_procedure(?)', projectId)
        const newKey = newKeyResponse.rows.shift().project_generate_next_sequence_val_procedure

        const newTaskData = {
            key: newKey,
            title,
            description,
            version,
            time_estimated: timeEstimated,
            time_spent: timeSpent,
            due_at: dueAt,
            author_id: authorId,
            project_id: projectId,
            priority_id: priorityId,
            type_id: typeId,
            status_id: statusId,
        }

        // let { key, title, description } = values
        // const projectKey = key || title.slice(0, 3).toUpperCase()
        // const sequenceName = `project_${projectKey}`
        // let createdTask = {}

        // let createdTask = await knex(this.tableName)
        //     .returning(['id', 'key', 'title', 'description', 'version', 'time_estimated', 'time_spent', 'due_at', 'created_at', 'updated_at'])
        //     .insert({
        //         key: newKey,
        //         title,
        //         description,
        //         version,
        //         time_estimated: timeEstimated,
        //         time_spent: timeSpent,
        //         due_at: dueAt,
        //         author_id: authorId,
        //         project_id: projectId
        //     })

        // return createdTask


        try {
            const trxProvider = knex.transactionProvider()
            const trx = await trxProvider()
            try {
                const taskIds = await trx(this.tableName).insert(newTaskData, 'id')
                const taskId = taskIds.shift()

                const taskLabels = labelIds.map(labelId => ({
                    task_id: taskId,
                    label_id: labelId
                }))
                await  trx(this.labelsTableName).insert(taskLabels)

                const taskAssignees = assignees.map(assignee => ({
                    task_id: taskId,
                    user_id: assignee.userId,
                    assignee_role_id: assignee.roleId
                }))
                await  trx(this.assigneesTableName).insert(taskAssignees)

                trx.commit()
            }
            catch (e) {
                trx.rollback()
                throw e
            }
        }
        catch (e) {
            throw e
        }
    }
}

module.exports = { Task }






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
