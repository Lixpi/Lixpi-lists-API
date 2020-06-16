'use strict'

const Sequelize = require('sequelize')

const sequelize = require('../db/sequelize')

/**
* Sessions table is used to store user session persistently.
*
*
* Read more on https://www.npmjs.com/package/connect-session-sequelize
*/
const mappings = {
    sid: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    expires: Sequelize.DATE,
    data: Sequelize.STRING(50000),
}

const Session = sequelize.define('Session', mappings, {
    indexes: [{
        name: 'session_sid_index',
        method: 'BTREE',
        fields: ['sid'],
    }],
    underscored: true
})

exports.mapping = mappings

exports.Session = Session
