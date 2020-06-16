'use strict';

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('labels', [{
            color: 'green',
            title: 'label1',
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            color: 'purple',
            title: 'label2',
            created_at: new Date(),
            updated_at: new Date()
        }])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('labels', null, {})
    }
}
