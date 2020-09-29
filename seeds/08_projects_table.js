'use strict'

const { Project } = require('../src/models/project')

exports.seed = function(knex) {
    return knex('projects').del()
        .then(function () {
            return Project.create({title: 'Parks', description: 'Parks project description'})
        })
}
