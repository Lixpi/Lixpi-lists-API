'use strict';

const { Label } = require('../src/label/model')

module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            Label.create({
                color: 'green',
                title: 'label1'
            }),
            Label.create({
                color: 'purple',
                title: 'label2'
            })
        ])
    },

    down: (queryInterface) => {
        return Label.destroy({ where: {}, truncate: true })
    }
}
