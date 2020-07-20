
exports.up = function(knex) {
  // return knex.schema.createTable('sessions2', function(table) {
  //       // table.increments('id').unsigned().primary()
  //       table.string('sid').primary()
  //       table.json('sess')
  //       table.dateTime('expired').notNull()
  //       table.index(['expired'], 'sessions_expired_index', 'BTREE');

  //   })
}

exports.down = function(knex) {
   // return knex.schema.dropTable('sessions');
}


// 'use strict'

// const { generateNextSeqVal } = require('../src/db/functions/generate_next_seq_val')

// module.exports = {
//     up: (queryInterface, Sequelize) => {
//         return queryInterface.sequelize.query(generateNextSeqVal)
//     },

//     down: (queryInterface, Sequelize) => {
//         return queryInterface.sequelize.query('DROP FUNCTION generate_next_seq_val;')
//     }
// }
