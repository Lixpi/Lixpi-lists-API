exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
        table.increments('id').primary()
        table.string('username').notNull()
        table.string('password').notNull()
        table.unique('username')
    })
}

exports.down = function(knex) {
   return knex.schema.dropTable('users');
}
