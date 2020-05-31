// const mongoose = require('mongoose')
// const { MongoMemoryServer } = require('mongodb-memory-server')
const { initDb, dropDb, syncModels } = require('../db/db-init')
const sequelize = require('../db/sequelize-singleton')

const { expect } = require('chai')

const { User } = require('../user/model')
const { Label } = require('../label/model')
const { Role } = require('../role/model')
const { Priority } = require('../task/priority/model')
const { Status } = require('../task/status/model')
const { Type } = require('../task/type/model')
const { createTask } = require('../task/services')

// const Task = require('./model')
// const User = require('../users/model')
// const { createTask, getTask, getTasks } = require('./services')

// let mongoServer

before(async () => {
    console.log('before *********************************************************************************************************\n')
    const createUsers = async () => {
        await User.create({ username: 'user1', password: '123123' })
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
    })

    afterEach( async () => {
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
        console.log('test *********************************************************************************************************\n')
        const newTaskData = {
            title: 'Seventhtask title',
            description: 'Task description',
                 type: 'bug',
                status: 'open',
            priority: 'critical',
            version: '1.0',
            labels: ['label1', 'label2'],
            timeEstimated: 124234,
            timeSpent: 124234,
            dueAt: '2020-11-11 00:00:00',
            assignees: [
                ['user1', 'developer'],
                ['user2', 'designer']
            ]
        }

        return await createTask(newTaskData)

        // const currentTimestamp = 1584660793927
        // const actualTask = await createTask(newTaskData, currentTimestamp)
        // const expectedTask = new Task(
        //     Object.assign({},
        //         { _id: actualTask._id },
        //         { key: 'KEY-1' },
        //         newTaskData,
        //         {
        //             timestamps: {
        //                 createdAt: currentTimestamp,
        //                 updatedAt: currentTimestamp
        //             }
        //         },
        //         { author: this.mockUser }
        //     )
        // )
        // expect(actualTask.equals(expectedTask)).to.be.true
    })
})
