'use strict';

const Task = require("./model");
const User = require("../users/model")

module.exports = function getTask (key) {
    return Task.findOne({key})
};
