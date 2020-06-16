'use strict';

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('roles', [{
            title: 'developer',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'designer',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            title: 'tester',
            created_at: new Date(),
            updated_at: new Date()
        }])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('roles', null, {})
    }
}
