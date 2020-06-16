const Sequelize = require('sequelize')

const sequelize = require('../../db/sequelize')

const mappings = {
    title: {
        type: Sequelize.TEXT,
        primaryKey: true
    }
}

const Status = sequelize.define('Status', mappings, { underscored: true })

exports.Status = Status
