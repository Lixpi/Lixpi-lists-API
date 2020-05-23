const Sequelize = require('sequelize')

const sequelize = require('../../db/sequelize-singleton')

const mappings = {
    title: {
        type: Sequelize.TEXT,
        primaryKey: true
    }
}

const Type = sequelize.define('Type', mappings)

exports.Type = Type
