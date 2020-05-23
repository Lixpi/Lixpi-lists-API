const Sequelize = require('sequelize')

const sequelize = require('../../db/sequelize-singleton')

const mappings = {
    title: {
        type: Sequelize.TEXT,
        primaryKey: true
    }
}

const Priority = sequelize.define('Priority', mappings)

exports.Priority = Priority
