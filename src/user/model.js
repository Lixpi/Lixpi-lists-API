const _ = require('lodash')
const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt'))

const { knex } = require('../db/knex')

class User {
    static tableName = 'users'

    constructor(values = {}) {
        Object.assign(this, values)
    }

    static init(values) {
        return new this(values)
    }

    static async findById(id) {
        const values =  await knex(this.tableName).where({ id }).first()
        return this.init(values)
    }

    static async findByUsername(username) {
        const values =  await knex(this.tableName).where({ username }).first()
        return this.init(values)
    }

    static async create(values) {
        let { username, password } = values

        const salt = bcrypt.genSaltSync(10)
        password = bcrypt.hashSync(password, salt)

        return knex(this.tableName).insert({username, password})
    }

    comparePassword (password) {
        return Promise.resolve()
            .then(() => bcrypt.compareSync(password, this.password))
            .catch(err => err)
    }
}

module.exports = { User }
