const _ = require('lodash');
const Sequelize = require('sequelize');

const sequelize = require('../db/sequelize-singleton');

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
