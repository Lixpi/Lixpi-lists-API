'use strict'

const { knex } = require('../db/knex')
const { canFindById, canGetAll, canDeleteById } = require('../core/model')

const config = {
    tableName: 'statuses'
}

const Model = (config) => {
    let state = {}

    const create = async values => {
        values = Array.isArray(values) ? values : [values]

        const insertData = values.map(type => ({
            title: type.title,
        }))

        return knex(config.tableName).insert(insertData)
    }

    return {
        ...state,
        ...canGetAll(config),
        ...canFindById(config),
        create,
        ...canDeleteById(config)
    }
}

const Status = Model(config)

module.exports = { Status }
