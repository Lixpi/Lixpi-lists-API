'use strict'

const { knex } = require('../db/knex')
const { canFindById, canGetAll, canDelete } = require('../core/model')

const config = {
    tableName: 'versions'
}

const Model = (config) => {
    let state = {}

    const create = async values => {
        values = Array.isArray(values) ? values : [values]

        const insertData = values.map(version => ({
            color: version.color,
            title: version.title
        }))

        return knex(config.tableName).insert(insertData)
    }

    return {
        ...state,
        ...canGetAll(config),
        ...canFindById(config),
        create,
        ...canDelete(config)
    }
}

const Version = Model(config)

module.exports = { Version }
