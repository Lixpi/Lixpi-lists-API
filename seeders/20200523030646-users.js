'use strict'

const { User } = require('../src/user/model')

module.exports = {
    up: (queryInterface) => {
        return Promise.all([
            User.create({
                username: 'nargiza',
                password: 'password'
            }),
            User.create({
                username: 'shelby',
                password: 'password'
            })
        ])
    },

    down: (queryInterface) => {
        return User.destroy({ where: {}, truncate: true })
    }
}
