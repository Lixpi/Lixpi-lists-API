'use strict'

exports.seed = function(knex) {
    return knex('types').del()
        .then(function () {
            return knex('types').insert([
                {id: 1, title: 'bug'},
                {id: 2, title: 'feature'},
                {id: 3, title: 'investigation'}
            ])
        })
}
