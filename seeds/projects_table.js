'use strict'

exports.seed = function(knex) {
    return knex('projects').del()
        .then(function () {
            return knex('projects').insert([
                {id: 1, key: 'PAR', title: 'Parks', description: ''},
                {id: 2, key: 'REC', title: 'Recreation', description: ''}
            ])
        })
}
