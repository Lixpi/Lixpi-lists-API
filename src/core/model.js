'use strict'

const { knex } = require('../db/knex')

module.exports = {
    canFindById: (config, state = {}) => ({
        ...state,
        findById: async id => Object.assign(
            state,
            await knex(config.tableName).where({ id }).first()
        )
    }),
    canFindByKey: (config, state = {}) => ({
        ...state,
        findByKey: async key => Object.assign(
            state,
            await knex(config.tableName).where({ key }).first()
        )
    }),
    canGetAll: (config, state = {}) => ({
        ...state,
        all: async () => Object.assign(
            state,
            await knex(config.tableName)
        )
    })
}
