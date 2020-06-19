'use strict'

const Sequelize = require('sequelize')

const sequelize = require('../db/sequelize')
const { Project } = require('../project/model')
const { User } = require('../user/model')
const { Role } = require('../role/model')
const { Label } = require('../label/model')
const { Type } = require('./type/model')
const { Status } = require('./status/model')
const { Priority } = require('./priority/model')

const { TEXT, INTEGER, DATE } = Sequelize

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
    },
    timeEstimated: {
        type: INTEGER,
        allowNull: true
    },
    timeSpent: {
        type: INTEGER,
        allowNull: true
    },
    dueAt: {
        type: DATE,
        allowNull: true
    }
}

const Task = sequelize.define('Task', mappings, {
    indexes: [{
        name: 'task_title_index',
        method: 'BTREE',
        fields: ['title'],
    }],
    underscored: true
})

// Adding projectKey to Task model
Task.belongsTo(Project)

// Adding authorId to Task model
Task.belongsTo(User, { as: 'author' })

// Adding task assignees using two tables <UserRole> and <TaskAssignee>
const UserRole = sequelize.define('UserRole', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
}, { timestamps: false, underscored: true })

User.belongsToMany(Role, { through: UserRole })
User.hasMany(UserRole)
Role.belongsToMany(User, { through: UserRole })
Role.hasMany(UserRole)
UserRole.belongsTo(User)
UserRole.belongsTo(Role)

const TaskAssignee = sequelize.define('TaskAssignee', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
}, { timestamps: false, underscored: true })

Task.belongsToMany(UserRole, { through: TaskAssignee })
Task.hasMany(TaskAssignee)
UserRole.belongsToMany(Task, { through: TaskAssignee })
UserRole.hasMany(TaskAssignee)
TaskAssignee.belongsTo(Task)
TaskAssignee.belongsTo(UserRole)

// Adding labels to task
const TaskLabel = sequelize.define('TaskLabel', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
}, { timestamps: false, underscored: true })

Task.belongsToMany(Label, { through: TaskLabel })
Task.hasMany(TaskLabel)
Label.belongsToMany(Task, { through: TaskLabel })
Label.hasMany(TaskLabel)
TaskLabel.belongsTo(Task)
TaskLabel.belongsTo(Label)

// Adding types to task
const TaskType = sequelize.define('TaskType', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
}, { timestamps: false, underscored: true })

Task.belongsToMany(Type, { through: TaskType })
Type.belongsToMany(Task, { through: TaskType })
TaskType.belongsTo(Task)
Type.hasMany(TaskType)
Task.hasMany(TaskType)
TaskType.belongsTo(Type)

// Adding status to task
const TaskStatus = sequelize.define('TaskStatus', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
}, { timestamps: false, underscored: true })

Task.belongsToMany(Status, { through: TaskStatus })
Status.belongsToMany(Task, { through: TaskStatus })
Task.hasMany(TaskStatus)
TaskStatus.belongsTo(Task)
Status.hasMany(TaskStatus)
TaskStatus.belongsTo(Status)

// Adding priority to task
const TaskPriority = sequelize.define('TaskPriority', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
}, { timestamps: false, underscored: true })

Task.belongsToMany(Priority, { through: TaskPriority })
Priority.belongsToMany(Task, { through: TaskPriority })
Task.hasMany(TaskPriority)
TaskPriority.belongsTo(Task)
Priority.hasMany(TaskPriority)
TaskPriority.belongsTo(Priority)

exports.UserRole = UserRole
exports.TaskAssignee = TaskAssignee
exports.TaskLabel = TaskLabel
exports.TaskType = TaskType
exports.TaskStatus = TaskStatus
exports.TaskPriority = TaskPriority
exports.Task = Task