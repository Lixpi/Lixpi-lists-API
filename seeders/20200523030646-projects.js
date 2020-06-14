'use strict';

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('Projects', [{
            key: 'PAR',
            title: 'Parks',
            description: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            key: 'REC',
            title: 'Recreation',
            description: '',
            createdAt: new Date(),
            updatedAt: new Date()
        }])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('Projects', null, {})
    }
}
