'use strict'

exports.seed = function(knex) {
    return knex('statuses').del()
        .then(function () {
            return knex('statuses').insert([
                {id: 1, title: 'new'},
                {id: 2, title: 'in progress'},
                {id: 3, title: 'closed'}
            ])
        })
}
