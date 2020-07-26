
exports.up = function(knex) {
  return knex.schema.createTable('projects', function(table) {
        table.increments('id').primary()
        table.string('key').notNull()
        table.string('title').notNull()
        table.string('description')
        table.unique('key')
    })
}

exports.down = function(knex) {
  return knex.schema.dropTable('projects')
}
