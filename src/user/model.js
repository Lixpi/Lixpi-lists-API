'use strict'

const { knex } = require('../db/knex')
const { Model } = require('../core/model')

const bcrypt = require('bcrypt')

class User extends Model {
    static tableName = 'users'

    static async findById(id) {
        const values =  await knex(this.tableName).where({ id }).first()
        return this.init(values)
    }

    static async findByUsername(username) {
        const values =  await knex(this.tableName).where({ username }).first()
        return this.init(values)
    }

    static async create(values) {
        values = Array.isArray(values) ? values : [values]

        const insertData = values.map(user => ({
            username: user.username,
            password: bcrypt.hashSync(user.password, bcrypt.genSaltSync(10))
        }))

        return knex(this.tableName).insert(insertData)
    }

    comparePassword (password) {
        return Promise.resolve()
            .then(() => bcrypt.compareSync(password, this.password))
            .catch(err => err)
    }
}

module.exports = { User }
