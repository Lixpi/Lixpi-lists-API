
exports.up = function(knex) {
  return knex.schema.createTable('project_sequences', function(table) {
        table.increments('id').primary()
        table.string('projectKey').notNull()
        table.integer('nextValue').unsigned().notNull()
        table.unique('projectKey')
    })
}

exports.down = function(knex) {
  return knex.schema.dropTable('project_sequences')
}
