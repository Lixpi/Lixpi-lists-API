'use strict';

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('projects', [{
            key: 'PAR',
            title: 'Parks',
            description: '',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            key: 'REC',
            title: 'Recreation',
            description: '',
            created_at: new Date(),
            updated_at: new Date()
        }])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('projects', null, {})
    }
}
