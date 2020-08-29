'use strict'

const { knex } = require('../db/knex')

module.exports = {
    canFindById: config => ({
        findById: async id => await knex(config.tableName).where({ id }).first()
    }),
    canFindByKey: config => ({
        findByKey: async key => await knex(config.tableName).where({ key }).first()
    }),
    canGetAll: config => ({
        all: async () => await knex(config.tableName).orderBy('key')
    })
}
