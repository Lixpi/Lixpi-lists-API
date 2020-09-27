'use strict'

const { knex } = require('../db/knex')

module.exports = {
    canFindById: config => ({
        findById: async id => await knex(config.tableName).where({id}).first()
    }),
    canFindByKey: config => ({
        findByKey: async key => await knex(config.tableName).where({key}).first()
    }),
    canGetAll: config => ({
        getAll: async () => await knex(config.tableName)
    }),
    canDelete: config => ({
        delete: async id => await knex(config.tableName).where({id}).del()
    }),
}
