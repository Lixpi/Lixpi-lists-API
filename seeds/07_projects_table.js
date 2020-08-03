'use strict'

const { Project } = require('../src/project/model')

exports.seed = function(knex) {
    return knex('projects').del()
        .then(function () {
            return Project.create({title: 'Parks', description: 'Parks project description'})
        })
}
