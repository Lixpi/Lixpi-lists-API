'use strict';

const Task = require('./model');
const User = require('../users/model')

module.exports = async function getTask (key) {
    const task = await Task.findOne({key}).
    populate('author').
    exec()
    return task
};
