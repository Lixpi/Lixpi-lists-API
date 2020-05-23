'use strict';

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('Types', [{
            title: 'bug',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: 'feature',
            createdAt: new Date(),
            updatedAt: new Date()
        }])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('Types', null, {})
    }
}
