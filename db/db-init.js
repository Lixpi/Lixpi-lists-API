const sequelize = require('./sequelize')

const { User } = require('../user/model')
const { Session } = require('../session/model')
const { Label } = require('../label/model')
const { Type } = require('../task/type/model')
const { Status } = require('../task/status/model')
const { Priority } = require('../task/priority/model')
const { Role } = require('../role/model')
const { Task, TaskLabel, TaskType, TaskStatus, TaskPriority, UserRole, TaskAssignee } = require('../task/model')

const syncModels = async () => {
    console.log('Initializing models!')
    sequelize.sync({ force:true })
}

module.exports = {
    syncModels
}
