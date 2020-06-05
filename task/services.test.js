// const mongoose = require('mongoose')
// const { MongoMemoryServer } = require('mongodb-memory-server')
const { initDb, dropDb, syncModels } = require('../db/db-init')
const sequelize = require('../db/sequelize-singleton')
const sinon = require('sinon')

const { expect } = require('chai')

const { Label } = require('../label/model')
const { Role } = require('../role/model')
const { Priority } = require('../task/priority/model')
const { Status } = require('../task/status/model')
const { Type } = require('../task/type/model')
const { createTask } = require('../task/services')
const {
    TaskAssignee,
    UserRole,
    TaskLabel,
    TaskType,
    TaskStatus,
    TaskPriority
} = require('../task/model')
const { User } = require('../user/model')

let loggedInUser
let fakeTime
let currentTime

before(async () => {
    const createUsers = async () => {
        await User.create({ username: 'user1', password: '123123' }).then((user) => {
            loggedInUser = user
        })
        await User.create({ username: 'user2', password: '123123' })
    }

    const createLabels = async () => {
        await Label.create({ color: 'green', title: 'label1' })
        await Label.create({ color: 'purple', title: 'label2' })
    }

    const createRoles = async () => {
        await Role.create({ title: 'developer' })
        await Role.create({ title: 'designer' })
        await Role.create({ title: 'tester' })
    }

    const createPriorities = async () => {
        await Priority.create({ title: 'critical' })
        await Priority.create({ title: 'urgent' })
        await Priority.create({ title: 'blocking' })
    }

    const createStatuses = async () => {
        await Status.create({ title: 'new' })
        await Status.create({ title: 'closed' })
        await Status.create({ title: 'in progress' })
    }

    const createTypes = async () => {
        await Type.create({ title: 'bug' })
        await Type.create({ title: 'feature' })
    }

    return dropDb()
        .then(initDb)
        .then(syncModels)
        .then(createUsers)
        .then(createLabels)
        .then(createRoles)
        .then(createPriorities)
        .then(createStatuses)
        .then(createTypes)
})

after(async () => {
    console.log('after *********************************************************************************************************\n')
    return dropDb()
})

describe('Task CRUD operations', () => {
    beforeEach( async () => {
        console.log('beforeEach *********************************************************************************************************\n')
        fakeTime = sinon.useFakeTimers(new Date(2011,9,1).getTime());
        currentTime = new Date()
    })

    afterEach( async () => {
        fakeTime.restore();
        console.log('afterEach *********************************************************************************************************\n')
    })

    it('Should save task including relationships', async () => {
        const newTaskData = {
            title: 'Seventhtask title',
            description: 'Task description',
            type: 'bug',
            status: 'new',
            priority: 'critical',
            version: '1.0',
            authorId: loggedInUser.dataValues.id,
            labels: ['label1', 'label2'],
            timeEstimated: 124234,
            timeSpent: 124234,
            dueAt: currentTime,
            assignees: [
                { username: 'user1', role: 'developer' },
                { username: 'user2', role: 'designer' }
            ]
        }

        const expectedTask = {
            key: 'KEY-1',
            title: 'Seventhtask title',
            description: 'Task description',
            version: '1.0',
            timeEstimated: 124234,
            timeSpent: 124234,
            authorId: loggedInUser.dataValues.id,
            dueAt: currentTime,
            updatedAt: currentTime,
            createdAt: currentTime
        }

        const actualTask = await createTask(newTaskData)

        const taskAssignees = await TaskAssignee.findAll({
            where: {
                TaskKey: 'KEY-1'
            }
        })

        expect(actualTask.dataValues).to.deep.equal(expectedTask)

        const taskAssigneesPromissesArray = taskAssignees.map(async taskAssignee => {
            const userRole = await UserRole.findOne({
                where: {
                    id: taskAssignee.dataValues.UserRoleId
                }
            })
            const user = await User.findOne({
                where: {
                    id: userRole.UserId
                }
            })
            return {
                username: user.dataValues.username,
                role: userRole.dataValues.RoleTitle
            }
        })

        Promise.all(taskAssigneesPromissesArray).then((values) => {
            values.sort((a, b) => a.username.localeCompare(b.username))
            expect(values).to.deep.equal(newTaskData.assignees)
        })


        const taskLabels = await TaskLabel.findAll({
            where: {
                TaskKey: 'KEY-1'
            }
        })
        const actualTaskLabels = taskLabels.map(taskLabel => taskLabel.dataValues.LabelTitle).sort()
        expect(actualTaskLabels).to.deep.equal(newTaskData.labels)


        const actualTaskType = await TaskType.findOne({
            where: {
                TaskKey: 'KEY-1'
            }
        })
       expect(actualTaskType.dataValues.TypeTitle).to.equal(newTaskData.type)


       const actualTaskStatus = await TaskStatus.findOne({
            where: {
                TaskKey: 'KEY-1'
            }
        })
       expect(actualTaskStatus.dataValues.StatusTitle).to.equal(newTaskData.status)


       const actualTaskPriority = await TaskPriority.findOne({
            where: {
                TaskKey: 'KEY-1'
            }
        })
       expect(actualTaskPriority.dataValues.PriorityTitle).to.equal(newTaskData.priority)
    })
})
