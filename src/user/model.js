'use strict'

const bcrypt = require('bcrypt')
const { knex } = require('../db/knex')
const { canFindById } = require('../core/model')

const config = {
    tableName: 'users'
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

        return knex(config.tableName).insert(insertData)
    }

    const comparePassword = password => {
        return Promise.resolve()
            .then(() => bcrypt.compareSync(password, state.password))
            .catch(err => err)
    }

    return {
        ...canFindById(config, state),
        findByUsername,
        create,
        comparePassword
    }
}

const User = Model(config)

module.exports = { User }
