'use strict';

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert('Labels', [{
            color: 'green',
            title: 'label1',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            color: 'purple',
            title: 'label2',
            createdAt: new Date(),
            updatedAt: new Date()
        }])
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('Labels', null, {})
    }
}
