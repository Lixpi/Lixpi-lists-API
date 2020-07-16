'use strict';

const { Status } = require('../src/task/status/model')

module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            Status.create({
                title: 'new'
            }),
            Status.create({
                title: 'closed'
            }),
            Status.create({
                title: 'in progress'
            })
        ])
    },

    down: (queryInterface) => {
        return Status.destroy({ where: {}, truncate: true })
    }
}