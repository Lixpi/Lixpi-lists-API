'use strict'

const Sequelize = require('sequelize')
const { TEXT } = Sequelize

const sequelize = require('../db/sequelize')
const { ProjectSequence } = require('../project_sequence/model')

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

Project.afterSave((project) => {
    const sequenceName = 'project_' + project.key.toLowerCase()
    sequelize.query('CREATE SEQUENCE ' + sequenceName)

    ProjectSequence.create({
        sequenceName: sequenceName,
        prefix: project.key,
        projectKey: project.key
    })

    return project
})

// TODO: add afterDestroy hook and drop all sequences

exports.Project = Project
