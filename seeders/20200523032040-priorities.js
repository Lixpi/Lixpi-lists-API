'use strict';

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('priorities', [{
            title: 'critical',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'urgent',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'blocking',
            created_at: new Date(),
            updated_at: new Date()
        }])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('priorities', null, {})
    }
}
