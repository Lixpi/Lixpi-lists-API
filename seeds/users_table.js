'use strict'

const bcrypt = require('bcrypt')

exports.seed = function(knex) {
    return knex('users').del()
        .then(function () {
            const salt = bcrypt.genSaltSync(10)
            const password = bcrypt.hashSync('password', salt)
            return knex('users').insert([
                {id: 1, username: 'shelby', password: password},
                {id: 2, username: 'nargiza', password: password}
            ])
        })
}
