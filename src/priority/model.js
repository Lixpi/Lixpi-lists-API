'use strict'

const { knex } = require('../db/knex')
const { canFindById, canGetAll } = require('../core/model')

const config = {
    tableName: 'priorities'
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

    const del = async id => knex(config.tableName).where({id}).del()

    return {
        ...state,
        ...canGetAll(config),
        ...canFindById(config),
        create,
        del
    }
}

const Priority = Model(config)

module.exports = { Priority }
