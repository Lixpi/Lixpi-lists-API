'use strict';

const { expect } = require('chai')
const sinon = require('sinon')
const sinonTest = require('sinon-test')

const Task = require('./model');
const getTask = require('./services')

var test = sinonTest(sinon);

describe('Task CRUD operations', () => {
    it('should call findOne method on Task model with given key', test(function() {
        const spy = this.spy(Task, 'findOne');
        getTask('TEST-1')
        sinon.assert.calledWith(spy, { key:'TEST-1' });
    }));
});
