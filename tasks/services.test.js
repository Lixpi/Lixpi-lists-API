const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { expect } = require('chai')

const Task = require('./model');
const User = require('../users/model')
const { getTask, getTasks } = require("./services")

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
        const mockUser = await new User({ _id: mockUserId, username: 'testuser' }).save()
        const mockTask1 = await new Task({ _id: '5e684ececb19f70020661f45', key: 'TAS-1', author: mockUserId }).save()
        const mockTask2 = await new Task({ _id: '5e684ececb19f70020661f41', key: 'TAS-2', author: mockUserId }).save()
    });

    afterEach( async () => {
    });

    it('Should retrieve task by key including author', async () => {
        const task = await getTask('TAS-1')

        expect(task.author.username).to.equal('testuser')
    });

    it('Should retrieve tasks including author', async () => {
        const tasks = await getTasks()
        
        expect(tasks.length).to.equal(2)
        tasks.forEach((task) => {
            expect(task.author.username).to.equal('testuser')
        });
    });
});
