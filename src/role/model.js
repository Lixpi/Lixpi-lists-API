const Sequelize = require('sequelize')

const sequelize = require('../db/sequelize')

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

const Role = sequelize.define('Role', mappings, { underscored: true })

exports.Role = Role
