const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { expect } = require('chai')

const Task = require('./model');
const User = require('../users/model')
const { createTask, getTask, getTasks } = require("./services")

let mongoServer

before(async () => {
    mongoServer = new MongoMemoryServer()
    const mongoUri = await mongoServer.getUri()
    await mongoose.connect(mongoUri)
});

after(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
});

describe('Task CRUD operations', () => {
    beforeEach( async () => {
        // clean all collections before start in case tests didn't finish properly
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
        // TODO: seed from fixtures
        const mockUserId = mongoose.Types.ObjectId('5e684ebacb19f70020661f44');
        this.mockUser = await new User({ _id: mockUserId, username: 'testuser' }).save()
        this.mockTask1 = await new Task({ _id: '5e684ececb19f70020661f45', key: 'TAS-1', author: mockUserId }).save()
        this.mockTask2 = await new Task({ _id: '5e684ececb19f70020661f41', key: 'TAS-2', author: mockUserId }).save()
    });

    afterEach( async () => {
    });

    it('Should retrieve task by key including author', async () => {
        const actualTask = await getTask('TAS-1')

        expect(actualTask.equals(this.mockTask1)).to.be.true;
    });

    it('Should retrieve tasks including author', async () => {
        const actualTasks = await getTasks()
        const expectedTasks = [this.mockTask1, this.mockTask2]
        
        expect(actualTasks.length).to.equal(2)
        actualTasks.forEach((actualTask, i) => {
            expect(actualTask.equals(expectedTasks[i])).to.be.true;
        });
    });

    it('Should save task and return the new task including author', async () => {
        const newTaskData = {
            title: 'Title',
            description: 'Description',
            type: 'Type',
            status: 'Status',
            priority: 'Priority',
            version: 'Version',
            labels: [
                {
                    color: 'Color 1',
                    title: 'Label Title 1'
                },
                {
                    color: 'Color 2',
                    title: 'Label Title 2'
                }
            ],
            author: this.mockUser._id,
            timeTracking: {
                estimated: 500,
                spent: 200
            },
            dueAt: 1583687295554
        }
        const currentTimestamp = 1584660793927
        const actualTask = await createTask(newTaskData, currentTimestamp)
        const expectedTask = new Task(
            Object.assign({},
                { _id: actualTask._id },
                { key: 'KEY-1' },
                newTaskData,  
                { 
                    timestamps: {
                        createdAt: currentTimestamp,
                        updatedAt: currentTimestamp
                    }
                },
                { author: this.mockUser }
            )
        )
        expect(actualTask.equals(expectedTask)).to.be.true;
    });
});
