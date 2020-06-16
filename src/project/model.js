'use strict'

const Sequelize = require('sequelize')
const { TEXT } = Sequelize

const sequelize = require('../db/sequelize')

const mappings = {
    key: {
        type: TEXT,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: TEXT,
        allowNull: false
    },
    description: {
        type: TEXT,
        allowNull: true
    }
}

const Project = sequelize.define('Project', mappings, {
    indexes: [{
        name: 'project_title_index',
        method: 'BTREE',
        fields: ['title'],
    }],
    underscored: true
})

exports.Project = Project
