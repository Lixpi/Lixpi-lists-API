'use strict';

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('Priorities', [{
            title: 'critical',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: 'urgent',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: 'blocking',
            createdAt: new Date(),
            updatedAt: new Date()
        }])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('Priorities', null, {})
    }
}
