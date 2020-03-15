const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { expect } = require('chai')

const Task = require('./model');
const User = require('../users/model')
const getTask = require('./services')

beforeEach( async () => {
    const mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri);

    const mockUserId = mongoose.Types.ObjectId('5e684ebacb19f70020661f44');
    const mockUser = await new User({ _id: mockUserId, username: 'testuser' }).save()
    const mockTask1 = await new Task({ _id: '5e684ececb19f70020661f45', key: 'TAS-1', author: mockUserId }).save()
    const mockTask2 = await new Task({ _id: '5e684ececb19f70020661f41', key: 'TAS-2', author: mockUserId }).save()
});

afterEach(() => {
    mongoose.disconnect();
});

describe('Task CRUD operations', () => {
    it('Should retrieve task by key including author', async () => {
        const task = await getTask('TAS-1')

        expect(task.author.username).to.equal('testuser');
    });
});
