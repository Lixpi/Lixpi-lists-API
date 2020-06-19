'use strict'

const Sequelize = require('sequelize')
const { INTEGER, TEXT, UUID } = Sequelize

const sequelize = require('../db/sequelize')

const mappings = {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
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
        allowNull: false,
        defaultValue: 1
    },
    zeroPad: {
        type: INTEGER,
        allowNull: true,
        defaultValue: 5
    },
    projectKey: {
        type: TEXT,
        allowNull: false
    },
}

const ProjectSequence = sequelize.define('ProjectSequence', mappings, {
    indexes: [{
        name: 'project_sequence_project_key_sequence_name_index',
        method: 'BTREE',
        fields: ['project_key', 'sequence_name'],
    }],
    underscored: true
})

exports.ProjectSequence = ProjectSequence
