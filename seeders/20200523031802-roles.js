'use strict';

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('Roles', [{
            title: 'developer',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: 'designer',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: 'tester',
            createdAt: new Date(),
            updatedAt: new Date()
        }])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('Roles', null, {})
    }
}
