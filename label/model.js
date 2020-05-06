const _ = require('lodash');
const Sequelize = require('sequelize');

const sequelize = require('../db/sequelize-singleton');

const mappings = {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    color: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    title: {
        type: Sequelize.TEXT,
        allowNull: false,
    }
}

const Label = sequelize.define('Label', mappings, {
    indexes: [
        {
            name: 'label_title_index',
            method: 'BTREE',
            fields: ['title'],
        }
    ]
})

exports.Label = Label
