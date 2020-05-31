const Sequelize = require('sequelize')
const sequelize = require('./sequelize-singleton')
const { env } = require('../config/node-config-loader')

const { User } = require('../user/model')
const { Session } = require('../session/model')
const { Label } = require('../label/model')
const { Type } = require('../task/type/model')
const { Status } = require('../task/status/model')
const { Priority } = require('../task/priority/model')
const { Role } = require('../role/model')
const { Task, TaskLabel, TaskType, TaskStatus, TaskPriority, UserRole, TaskAssignee } = require('../task/model')

let sequelizeInstance

const initDb = async () => {
    sequelizeInstance = sequelize(false)
    return sequelizeInstance.query(`CREATE DATABASE ${env.DATABASE_NAME}`).then(data => {
        console.log(`Congrats comrade! Database '${env.DATABASE_NAME}' was initialized!`)
        console.log(data)
    })
    sequelizeInstance.close()
}

const dropDb = async () => {
    sequelizeInstance = sequelize(false)

    sequelizeInstance.query(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${env.DATABASE_NAME}'`).then(data => {
        console.log(`Dropping all active connections for '${env.DATABASE_NAME}' database!`)
        console.log(data)
    })
    return sequelizeInstance.query(`DROP DATABASE IF EXISTS ${env.DATABASE_NAME}`).then(data => {
        console.log(`Congrats comrade! Database '${env.DATABASE_NAME}' was dropped!`)
        console.log(data)
    })
    sequelizeInstance.close()
}

const syncModels = async () => {
    console.log(`Initializing models!`)
    await User.sync({ force:true })
    await Session.sync({ force:true })
    await Task.sync({ force:true })
    await Label.sync({ force:true })
    await Type.sync({ force:true })
    await Status.sync({ force:true })
    await Priority.sync({ force:true })
    await Role.sync({ force:true })
    await UserRole.sync({ force:true })
    await TaskAssignee.sync({ force:true })
    await TaskLabel.sync({ force:true })
    await TaskType.sync({ force:true })
    await TaskStatus.sync({ force:true })
    await TaskPriority.sync({ force:true })
}

module.exports = {
    initDb,
    dropDb,
    syncModels
}
