const { syncModels } = require('../db/db-init')
const sinon = require('sinon')

const { expect } = require('chai')

const { Label } = require('../label/model')
const { Role } = require('../role/model')
const { Priority } = require('../task/priority/model')
const { Status } = require('../task/status/model')
const { Type } = require('../task/type/model')
const { createTask } = require('./repository')
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
    const createUsers =() => {
        User.create({ username: 'user1', password: '123123' }).then((user) => {
            loggedInUser = user
        })
        User.create({ username: 'user2', password: '123123' })
    }

    const createLabels =() => {
        Label.create({ color: 'green', title: 'label1' })
        Label.create({ color: 'purple', title: 'label2' })
    }

    const createRoles =() => {
        Role.create({ title: 'developer' })
        Role.create({ title: 'designer' })
        Role.create({ title: 'tester' })
    }

    const createPriorities =() => {
        Priority.create({ title: 'critical' })
        Priority.create({ title: 'urgent' })
        Priority.create({ title: 'blocking' })
    }

    const createStatuses =() => {
        Status.create({ title: 'new' })
        Status.create({ title: 'closed' })
        Status.create({ title: 'in progress' })
    }

    const createTypes =() => {
        Type.create({ title: 'bug' })
        Type.create({ title: 'feature' })
    }

    return syncModels()
        .then(function() { return createUsers })
        .then(function() { return createLabels })
        .then(function() { return createRoles })
        .then(function() { return createPriorities })
        .then(function() { return createStatuses })
        .then(function() { return createTypes })
})

after(async () => {
    console.log('after *********************************************************************************************************\n')
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

    // it('ttt', async () => {
    //     const newTaskData = {
    //         title: 'Seventhtask title',
    //         description: 'Task description',
    //         type: 'bug',
    //         status: 'new',
    //         priority: 'critical',
    //         version: '1.0',
    //         authorId: loggedInUser.dataValues.id,
    //         labels: ['label1', 'label2'],
    //         timeEstimated: 124234,
    //         timeSpent: 124234,
    //         dueAt: currentTime,
    //         assignees: [
    //             { username: 'user1', role: 'developer' },
    //             { username: 'user2', role: 'designer' }
    //         ]
    //     }

    //     const expectedTask = {
    //         key: 'KEY-1',
    //         title: 'Seventhtask title',
    //         description: 'Task description',
    //         version: '1.0',
    //         timeEstimated: 124234,
    //         timeSpent: 124234,
    //         authorId: loggedInUser.dataValues.id,
    //         dueAt: currentTime,
    //         updatedAt: currentTime,
    //         createdAt: currentTime
    //     }

    //     const actualTask = await createTask(newTaskData)

    //     const task = await Task.findAll({
    //         include: [{
    //             model: TaskAssignee
    //         }]
    //     })

    //     debugger
    // })
})
