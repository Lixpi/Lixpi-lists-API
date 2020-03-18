const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { expect } = require('chai')

const Task = require('./model');
const User = require('../users/model')
const { getTask } = require('./services')

let mongoServer

before(async () => {
    mongoServer = new MongoMemoryServer({
  instance: {
    port: 9009, // by default choose any free port
    ip: '0.0.0.0', // by default '127.0.0.1', for binding to all IP addresses set it to `::,0.0.0.0`,
    // dbName?: string, // by default generate random dbName
    // dbPath?: string, // by default create in temp directory
    // storageEngine?: string, // by default `ephemeralForTest`, available engines: [ 'devnull', 'ephemeralForTest', 'mmapv1', 'wiredTiger' ]
    // replSet?: string, // by default no replica set, replica set name
    // auth?: boolean, // by default `mongod` is started with '--noauth', start `mongod` with '--auth'
    // args?: string[], // by default no additional arguments, any additional command line arguments for `mongod` `mongod` (ex. ['--notablescan'])
  }
})
    console.log('mongoServer')
    console.log(mongoServer)
    const mongoUri = await mongoServer.getUri()
    console.log('mongoUri')
    console.log(mongoUri)
    await mongoose.connect(mongoUri)
});

after(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
});

describe('Task CRUD operations', () => {
    beforeEach( async () => {
        // TODO: seed from fixtures
        const mockUserId = mongoose.Types.ObjectId('5e684ebacb19f70020661f44');
        const mockUser = await new User({ _id: mockUserId, username: 'testuser' }).save()
        const mockTask1 = await new Task({ _id: '5e684ececb19f70020661f45', key: 'TAS-1', author: mockUserId }).save()
        const mockTask2 = await new Task({ _id: '5e684ececb19f70020661f41', key: 'TAS-2', author: mockUserId }).save()
    });

    afterEach(() => {
        // TODO: drop DB records here
    });

    it('Should retrieve task by key including author', async () => {
        const task = await getTask('TAS-1')

        expect(task.author.username).to.equal('testuser')
    });
});
