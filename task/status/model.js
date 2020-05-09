const _ = require('lodash');
const Sequelize = require('sequelize');

const sequelize = require('../../db/sequelize-singleton');

const mappings = {
    status: {
        type: Sequelize.TEXT,
        primaryKey: true
    }
}

const Status = sequelize.define('Status', mappings)

exports.Status = Status
