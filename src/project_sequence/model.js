'use strict'

const Sequelize = require('sequelize')
const { INTEGER, TEXT, UUID } = Sequelize

const sequelize = require('../db/sequelize')
const { Project } = require('../project/model')

const mappings = {
    id: {
        type: UUID,
        primaryKey: true,
        allowNull: false
    },
    sequenceName: {
        type: TEXT,
        allowNull: false
    },
    prefix: {
        type: TEXT,
        allowNull: true
    },
    nextValue: {
        type: INTEGER,
        allowNull: true
    },
    zeroPad: {
        type: INTEGER,
        allowNull: true
    }
}

const ProjectSequence = sequelize.define('ProjectSequence', mappings, {
    indexes: [{
        name: 'project_sequence_project_key_sequence_name_index',
        method: 'BTREE',
        fields: ['project_key', 'sequence_name'],
    }],
    underscored: true
})

ProjectSequence.belongsTo(Project)

exports.ProjectSequence = ProjectSequence
