
exports.up = function(knex) {
  return knex.schema.createTable('sessions', function(table) {
        table.string('sid').primary()
        table.json('sess')
        table.dateTime('expired').notNull()
        table.index(['expired'], 'sessions_expired_index', 'BTREE')
    })
}

exports.down = function(knex) {
   return knex.schema.dropTable('sessions');
}
