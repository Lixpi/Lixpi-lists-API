'use strict'

const { knex } = require('../db/knex')

module.exports = {
    canFindById: (config, state) => ({
        findById: async id => state = await knex(config.tableName).where({ id }).first()
    }),
    canFindByKey: (config, state) => ({
        findByKey: async key => state = await knex(config.tableName).where({ key }).first()
    })
}
