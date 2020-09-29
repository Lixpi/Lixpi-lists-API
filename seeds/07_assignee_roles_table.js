'use strict'

exports.seed = function(knex) {
    return knex('assignee_roles').del()
        .then(function () {
            return knex('assignee_roles').insert([
                {id: 1, title: 'developer'},
                {id: 2, title: 'designer'},
                {id: 3, title: 'tester'}
            ])
        })
}
