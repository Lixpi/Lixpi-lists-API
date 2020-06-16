const Sequelize = require('sequelize')

const sequelize = require('../db/sequelize')

const mappings = {
    color: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    title: {
        type: Sequelize.TEXT,
        primaryKey: true,
    }
}

const Label = sequelize.define('Label', mappings, { underscored: true })

exports.Label = Label
