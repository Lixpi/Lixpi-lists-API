'use strict'

const { Task } = require('../src/models/task')

exports.seed = function(knex) {
    return knex('tasks').del()
        .then(function () {
            return Task.create({
                title: 'Move humanity to Mars',
                description: 'Lets get out of here',
                version: '1.0',
                timeEstimated: 124234,
                timeSpent: 124234,
                dueAt: '2030-11-11 00:00:00',
                projectId: 1,
                authorId: 1,
                priorityId: 1,
                typeId: 1,
                statusId: 1,
                labelIds: [1, 2],
                versionIds: [1, 2],
                assignees: [
                    {userId: 1, assigneeRoleId: 1}
                ]
            })
        })
}
