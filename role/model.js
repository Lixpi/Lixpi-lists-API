const Sequelize = require('sequelize')

const sequelize = require('../db/sequelize')

const mappings = {
    title: {
        type: Sequelize.TEXT,
        primaryKey: true
    }
}

const Role = sequelize.define('Role', mappings)

exports.Role = Role
