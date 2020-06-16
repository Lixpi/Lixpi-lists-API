'use strict';

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('types', [{
            title: 'bug',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'feature',
            created_at: new Date(),
            updated_at: new Date()
        }])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('types', null, {})
    }
}
