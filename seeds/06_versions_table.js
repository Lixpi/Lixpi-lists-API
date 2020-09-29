'use strict'

exports.seed = function(knex) {
    return knex('versions').del()
        .then(function () {
            return knex('versions').insert([
                {id: 1, color: 'orange', title: '0.1'},
                {id: 2, color: 'purple', title: '0.2'},
                {id: 3, color: 'pink', title: 'alpha'}
            ])
        })
}
