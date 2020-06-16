const Sequelize = require('sequelize')

const sequelize = require('../../db/sequelize')

const mappings = {
    title: {
        type: Sequelize.TEXT,
        primaryKey: true
    }
}

const Type = sequelize.define('Type', mappings, { underscored: true })

exports.Type = Type
