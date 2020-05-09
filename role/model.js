const _ = require('lodash');
const Sequelize = require('sequelize');

const sequelize = require('../db/sequelize-singleton');

const mappings = {
    role: {
        type: Sequelize.TEXT,
        primaryKey: true
    }
}

const Role = sequelize.define('Role', mappings)

exports.Role = Role