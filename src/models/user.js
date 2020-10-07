'use strict'

const bcrypt = require('bcrypt')
const { knex } = require('../db/knex')
const { canFindById, canGetAll, canDelete } = require('../core/model')

const config = {
    tableName: 'users',
    selectColumns: ['id', 'username']
}

const Model = (config) => {
    let state = {}

    const findByUsername = async username => state = await knex(config.tableName).where({ username }).first()

    const create = async values => {
        values = Array.isArray(values) ? values : [values]

        const insertData = values.map(user => ({
            username: user.username,
            password: bcrypt.hashSync(user.password, bcrypt.genSaltSync(10))
        }))

        return knex(config.tableName).insert(insertData).returning(['id', 'username'])
    }

    const comparePassword = password => {
        return Promise.resolve()
            .then(() => bcrypt.compareSync(password, state.password))
            .catch(err => err)
    }

    return {
        ...state,
        ...canGetAll(config),
        ...canFindById(config),
        findByUsername,
        create,
        comparePassword,
        ...canDelete(config)
    }
}

const User = Model(config)

module.exports = { User }
