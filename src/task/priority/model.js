const Sequelize = require('sequelize')

const sequelize = require('../../db/sequelize')

const mappings = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.TEXT
    }
}

const Priority = sequelize.define('Priority', mappings, { underscored: true })

exports.Priority = Priority
