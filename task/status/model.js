const Sequelize = require('sequelize')

const sequelize = require('../../db/sequelize-singleton')()

const mappings = {
    title: {
        type: Sequelize.TEXT,
        primaryKey: true
    }
}

const Status = sequelize.define('Status', mappings)

exports.Status = Status
