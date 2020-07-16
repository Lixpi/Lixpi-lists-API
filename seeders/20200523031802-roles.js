'use strict';

const { Role } = require('../src/role/model')

module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            Role.create({
                title: 'developer'
            }),
            Role.create({
                title: 'designer'
            }),
            Role.create({
                title: 'tester'
            })
        ])
    },

    down: (queryInterface) => {
        return Role.destroy({ where: {}, truncate: true })
    }
}
