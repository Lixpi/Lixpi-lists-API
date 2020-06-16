const Sequelize = require('sequelize')

const sequelize = require('../../db/sequelize')

const mappings = {
    title: {
        type: Sequelize.TEXT,
        primaryKey: true
    }
}

const Priority = sequelize.define('Priority', mappings, { underscored: true })

exports.Priority = Priority
