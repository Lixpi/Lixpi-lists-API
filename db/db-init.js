
const Sequelize = require('sequelize')
const sequelize = require('./sequelize-singleton')

const { env } = require('../config/node-config-loader')

let sequelizeInstance

// const { User } = require('../user/model')
// const { Session } = require('../session/model')
// const { Label } = require('../label/model')
// const { Type } = require('../task/type/model')
// const { Status } = require('../task/status/model')
// const { Priority } = require('../task/priority/model')
// const { Role } = require('../role/model')
// const { Task, TaskLabel, TaskType, TaskStatus, TaskPriority, UserRole, TaskAssignee } = require('../task/model')

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
    return sequelizeInstance.query(`DROP DATABASE IF EXISTS ${env.DATABASE_NAME}`).then(data => {
        console.log(`Congrats comrade! Database '${env.DATABASE_NAME}' was dropped!`)
        console.log(data)
    })
    sequelizeInstance.close()
}

const syncModels = async () => {
    sequelizeInstance = sequelize()
    await sequelizeInstance.sync();
    // sequelizeInstance.close()
    // await User.sync({ alter: true, force:true })
    // await Session.sync({ alter: true, force:true })
    // await Task.sync({ alter: true, force:true })
    // await Label.sync({ alter: true, force:true })
    // await Type.sync({ alter: true, force:true })
    // await Status.sync({ alter: true, force:true })
    // await Priority.sync({ alter: true, force:true })
    // await Role.sync({ alter: true, force:true })
    // await UserRole.sync({ alter: true, force:true })
    // await TaskAssignee.sync({ alter: true, force:true })
    // await TaskLabel.sync({ alter: true, force:true })
    // await TaskType.sync({ alter: true, force:true })
    // await TaskStatus.sync({ alter: true, force:true })
    // await TaskPriority.sync({ alter: true, force:true })
}

module.exports = {
    initDb,
    dropDb,
    syncModels
}
