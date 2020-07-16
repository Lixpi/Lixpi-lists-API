'use strict';

const { Type } = require('../src/task/type/model')

module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            Type.create({
                title: 'bug'
            }),
            Type.create({
                title: 'feature'
            }),
            Type.create({
                title: 'investigation'
            })
        ])
    },

    down: (queryInterface) => {
        return Type.destroy({ where: {}, truncate: true })
    }
}
