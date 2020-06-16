'use strict';

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('statuses', [{
            title: 'new',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'closed',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'in progress',
            created_at: new Date(),
            updated_at: new Date()
        }])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('statuses', null, {})
    }
}
