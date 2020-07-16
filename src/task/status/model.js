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

const Status = sequelize.define('Status', mappings, { underscored: true })

exports.Status = Status
