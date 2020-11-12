'use strict'

const { knex } = require('../db/knex')

module.exports = {
    canFindById: config => ({
        findById: async id => await knex(config.tableName)
            .select(...config.selectColumns || '*')
            .where({id})
            .first()
    }),
    canFindByKey: config => ({
        findByKey: async key => await knex(config.tableName)
            .select(...config.selectColumns || '*')
            .where({key})
            .first()
    }),
    canGetAll: (config, orderBy = 'id') => ({
        getAll: async () => await knex(config.tableName)
            .select(...config.selectColumns || '*')
            .orderBy(orderBy)
    }),
    canDeleteById: config => ({
        delete: async id => await knex(config.tableName)
            .where({id})
            .del()
    }),
    canDeleteByKey: config => ({
        delete: async key => await knex(config.tableName)
            .where({key})
            .del()
    }),
}
