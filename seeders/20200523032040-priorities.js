'use strict';

const { Priority } = require('../src/task/priority/model')

module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            Priority.create({
                title: 'critical'
            }),
            Priority.create({
                title: 'urgent'
            }),
            Priority.create({
                title: 'blocker'
            })
        ])
    },

    down: (queryInterface) => {
        return Priority.destroy({ where: {}, truncate: true })
    }
}
