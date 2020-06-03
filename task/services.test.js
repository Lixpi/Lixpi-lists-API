// const mongoose = require('mongoose')
// const { MongoMemoryServer } = require('mongodb-memory-server')
const { initDb, dropDb, syncModels } = require('../db/db-init')
const sequelize = require('../db/sequelize-singleton')
const sinon = require('sinon')

const { expect } = require('chai')

const { User } = require('../user/model')
const { Label } = require('../label/model')
const { Role } = require('../role/model')
const { Priority } = require('../task/priority/model')
const { Status } = require('../task/status/model')
const { Type } = require('../task/type/model')
const { createTask } = require('../task/services')
const { TaskAssignee, UserRole } = require('../task/model')

// const Task = require('./model')
// const User = require('../users/model')
// const { createTask, getTask, getTasks } = require('./services')

// let mongoServer
let loggedInUser
let fakeTime
let currentTime

before(async () => {
    const createUsers = async () => {
        await User.create({ username: 'user1', password: '123123' }).then((user) => {
            // console.log('user>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            // console.log(user)
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


    // initDb()
    // syncModels()

    // mongoServer = new MongoMemoryServer()
    // const mongoUri = await mongoServer.getUri()
    // await mongoose.connect(mongoUri)
})

after(async () => {

    console.log('after *********************************************************************************************************\n')
    // dropDb()
    // await mongoose.disconnect()
    // await mongoServer.stop()
})

describe('Task CRUD operations', () => {
    beforeEach( async () => {
        console.log('beforeEach *********************************************************************************************************\n')
        // // clean all collections before start in case tests didn't finish properly
        // const collections = mongoose.connection.collections
        // for (const key in collections) {
        //     const collection = collections[key]
        //     await collection.deleteMany()
        // }
        // // TODO: seed from fixtures
        // const mockUserId = mongoose.Types.ObjectId('5e684ebacb19f70020661f44')
        // this.mockUser = await new User({ _id: mockUserId, username: 'testuser' }).save()
        // this.mockTask1 = await new Task({ _id: '5e684ececb19f70020661f45', key: 'TAS-1', author: mockUserId }).save()
        // this.mockTask2 = await new Task({ _id: '5e684ececb19f70020661f41', key: 'TAS-2', author: mockUserId }).save()
        fakeTime = sinon.useFakeTimers(new Date(2011,9,1).getTime());
        currentTime = new Date()
    })

    afterEach( async () => {
        fakeTime.restore();
        console.log('afterEach *********************************************************************************************************\n')
    })

    // it('Should retrieve task by key including author', async () => {
    //     const actualTask = await getTask('TAS-1')

    //     expect(actualTask.equals(this.mockTask1)).to.be.true
    // })

    // it('Should retrieve tasks including author', async () => {
    //     const actualTasks = await getTasks()
    //     const expectedTasks = [this.mockTask1, this.mockTask2]

    //     expect(actualTasks.length).to.equal(2)
    //     actualTasks.forEach((actualTask, i) => {
    //         expect(actualTask.equals(expectedTasks[i])).to.be.true
    //     })
    // })

    it('Should save task and return the new task including author', async () => {
        const newTaskData = {
            title: 'Seventhtask title',
            description: 'Task description',
            type: 'bug',
            status: 'open',
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

        // const asdf = await TaskAssignee.findAll()


        // console.log('asffdfaldhflasdhflj')
        // console.log(asdf)

        expect(actualTask.dataValues).to.deep.equal(expectedTask);
    })
})
