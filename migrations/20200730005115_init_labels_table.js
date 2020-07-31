
exports.up = function(knex) {
    return knex.schema.createTable('labels', function(table) {
        table.increments('id').primary()
        table.string('color').notNull()
        table.string('title').notNull()
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable('labels')
}
