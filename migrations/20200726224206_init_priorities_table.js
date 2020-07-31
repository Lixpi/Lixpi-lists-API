
exports.up = function(knex) {
    return knex.schema.createTable('priorities', function(table) {
        table.increments('id').primary()
        table.string('title').notNull()
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable('priorities')
}
