'use strict'

exports.seed = function(knex) {
    return knex('priorities').del()
        .then(function () {
            return knex('priorities').insert([
                {id: 1, title: 'critical'},
                {id: 2, title: 'urgent'},
                {id: 3, title: 'blocker'}
            ])
        })
}
