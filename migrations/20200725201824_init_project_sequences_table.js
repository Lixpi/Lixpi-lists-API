
exports.up = function(knex) {
    return knex.schema.createTable('project_sequences', function(table) {
        table.increments('id').primary()
        table.string('project_key').notNull()
        table.integer('next_value').unsigned().notNull()
        table.unique('project_key')
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable('project_sequences')
}
