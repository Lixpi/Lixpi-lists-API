'use strict'

const bcrypt = require('bcrypt')
const { User } = require('../src/user/model')

exports.seed = function(knex) {
    return knex('users').del()
        .then(function () {
            return User.create({username: 'nargiza', password: 'password'})
        })
}
