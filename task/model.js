'use strict'

const Sequelize = require('sequelize')

const sequelize = require('../db/sequelize-singleton')
const { User } = require('../user/model')
const { Role } = require('../role/model')
const { Label } = require('../label/model')
const { Type } = require('./type/model')
const { Status } = require('./status/model')
const { Priority } = require('./priority/model')

const { TEXT, INTEGER } = Sequelize

const mappings = {
    key: {
        type: TEXT,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: TEXT,
        allowNull: false
    },
    description: {
        type: TEXT,
        allowNull: true
    },
    version: {
        type: TEXT,
        allowNull: true
    }
}

const Task = sequelize.define('Task', mappings, {
    indexes: [{
        name: 'task_title_index',
        method: 'BTREE',
        fields: ['title'],
    }],
})

Task.belongsTo(User, { as: 'author' })

const TaskAssignee = sequelize.define('TaskAssignee', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
}, { timestamps: false })

TaskAssignee.belongsTo(Role, { as: 'role' })
Task.belongsToMany(User, { through: TaskAssignee })
User.belongsToMany(Task, { through: TaskAssignee })
Task.hasMany(TaskAssignee)
TaskAssignee.belongsTo(Task)
User.hasMany(TaskAssignee)
TaskAssignee.belongsTo(User)

const TaskLabel = sequelize.define('TaskLabel', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
}, { timestamps: false })

Task.belongsToMany(Label, { through: TaskLabel })
Task.hasMany(TaskLabel)
Label.belongsToMany(Task, { through: TaskLabel })
Label.hasMany(TaskLabel)
TaskLabel.belongsTo(Task)
TaskLabel.belongsTo(Label)

const TaskType = sequelize.define('TaskType', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
}, { timestamps: false })

Task.belongsToMany(Type, { through: TaskType })
Type.belongsToMany(Task, { through: TaskType })
TaskType.belongsTo(Task)
Type.hasMany(TaskType)
Task.hasMany(TaskType)

TaskType.belongsTo(Type)

const TaskStatus = sequelize.define('TaskStatus', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
}, { timestamps: false })

Task.belongsToMany(Status, { through: TaskStatus })
Status.belongsToMany(Task, { through: TaskStatus })
Task.hasMany(TaskStatus)
TaskStatus.belongsTo(Task)
Status.hasMany(TaskStatus)
TaskStatus.belongsTo(Status)

const TaskPriority = sequelize.define('TaskPriority', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
}, { timestamps: false })

Task.belongsToMany(Priority, { through: TaskPriority })
Priority.belongsToMany(Task, { through: TaskPriority })
Task.hasMany(TaskPriority)
TaskPriority.belongsTo(Task)
Priority.hasMany(TaskPriority)
TaskPriority.belongsTo(Priority)

exports.TaskAssignee = TaskAssignee
exports.TaskLabel = TaskLabel
exports.TaskType = TaskType
exports.TaskStatus = TaskStatus
exports.TaskPriority = TaskPriority
exports.Task = Task

// let TaskSchema = new mongoose.Schema({
//     timeTracking: {
//         estimated: Number,
//         spent: Number
//     },
//     dueAt: Number,
// });
