'use strict'

const { generateNextSeqVal } = require('../src/db/functions/generate_next_seq_val')

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(generateNextSeqVal)
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('DROP FUNCTION generate_next_seq_val;')
    }
}
