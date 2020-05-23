'use strict';

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('Statuses', [{
            title: 'new',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: 'closed',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: 'in progress',
            createdAt: new Date(),
            updatedAt: new Date()
        }])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('Statuses', null, {})
    }
}
