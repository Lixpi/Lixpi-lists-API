'use strict'
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')

module.exports = {
    up: (queryInterface) => {
        const salt = bcrypt.genSaltSync(10)
        return queryInterface.bulkInsert('users', [{
            id: uuidv4(),
            username: 'nargiza',
            password: bcrypt.hashSync('password1', salt),
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            id: uuidv4(),
            username: 'shelby',
            password: bcrypt.hashSync('password2', salt),
            created_at: new Date(),
            updated_at: new Date()
        }])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('users', null, {})
    }
}
