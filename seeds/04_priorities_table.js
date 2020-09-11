'use strict'

exports.seed = function(knex) {
    return knex('priorities').del()
        .then(function () {
            return knex('priorities').insert([
                {id: 1, title: 'low'},
                {id: 2, title: 'regular'},
                {id: 3, title: 'high'},
                {id: 4, title: 'critical'}
            ])
        })
}
