const { User } = require('./user/model')
const { Session } = require('./session/model')
const { Label } = require('./label/model')
const { Type } = require('./task/type/model')
const { Status } = require('./task/status/model')
const { Priority } = require('./task/priority/model')
const { Role } = require('./role/model')
const { Task, TaskLabel, TaskType, TaskStatus, TaskPriority, UserRole, TaskAssignee } = require('./task/model')

const syncModels = (async () => {
    await User.sync({ alter: true, force:true })
    await Session.sync({ alter: true, force:true })
    await Task.sync({ alter: true, force:true })
    await Label.sync({ alter: true, force:true })
    await Type.sync({ alter: true, force:true })
    await Status.sync({ alter: true, force:true })
    await Priority.sync({ alter: true, force:true })
    await Role.sync({ alter: true, force:true })
    await UserRole.sync({ alter: true, force:true })
    await TaskAssignee.sync({ alter: true, force:true })
    await TaskLabel.sync({ alter: true, force:true })
    await TaskType.sync({ alter: true, force:true })
    await TaskStatus.sync({ alter: true, force:true })
    await TaskPriority.sync({ alter: true, force:true })
})

module.exports = {
    syncModels
}
