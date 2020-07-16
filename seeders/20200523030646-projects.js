'use strict';

const { Project } = require('../src/project/model')

module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            Project.create({
                key: 'PAR',
                title: 'Parks',
                description: '',
            }),
            Project.create({
                key: 'REC',
                title: 'Recreation',
                description: '',
            })
        ])
    },

    down: (queryInterface) => {
        return Project.destroy({ where: {}, truncate: true })
    }
}
