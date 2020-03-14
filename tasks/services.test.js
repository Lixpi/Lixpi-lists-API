'use strict';

const { expect } = require('chai')
const sinon = require('sinon')
const sinonTest = require('sinon-test')

const Task = require('./model');
const User = require('./model');
const getTask = require('./services')

const test = sinonTest(sinon);

describe('Task CRUD operations', () => {
    // it('should call findOne method on Task model with given key', test(function() {
    //     const spyTask = this.spy(Task, 'findOne');
    //     const spyUser = this.spy(User, 'findById');

    //     getTask('TEST-1')
    //     sinon.assert.calledWith(spyTask, { key:'TEST-1' });
    //     sinon.assert.called(spyUser);
    // }));

    it('should find task and user and return together', test(async function() {
        const mockUser = new User({ id: '5e684ebacb19f70020661f44', username: 'testuser' });
        const mockTask = new Task({ id: '5e684ececb19f70020661f45', key: 'TEST-1', author: mockUser });
        
        const mockTaskFindOne = {
            exec: function () {
                return mockTask
            }
        };

        const mockUserFindById = {
            exec: function () {
                return mockUser
            }
        };

        this.stub(Task, 'findOne').returns(mockTaskFindOne)
        this.stub(User, 'findById').returns(mockUserFindById)
        const task = getTask('TEST-1')
     
        sinon.assert.calledWith(Task.findOne, { key: 'TEST-1' })
        // sinon.assert.calledWith(User.findById, 'testid')
    }));
});
