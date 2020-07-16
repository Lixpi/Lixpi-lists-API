const Sequelize = require('sequelize')

const sequelize = require('../db/sequelize')

const mappings = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    color: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    title: {
        type: Sequelize.TEXT
    }
}

const Label = sequelize.define('Label', mappings, { underscored: true })

exports.Label = Label
