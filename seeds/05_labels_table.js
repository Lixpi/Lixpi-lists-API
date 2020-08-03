'use strict'

exports.seed = function(knex) {
    return knex('labels').del()
        .then(function () {
            return knex('labels').insert([
                {id: 1, color: 'green', title: 'green'},
                {id: 2, color: 'purple', title: 'purple'},
                {id: 3, color: 'red', title: 'red'}
            ])
        })
}
