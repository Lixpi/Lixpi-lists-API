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

const Type = sequelize.define('Type', mappings, { underscored: true })

exports.Type = Type
