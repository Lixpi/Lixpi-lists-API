
exports.up = function(knex) {
    return knex.schema.createTable('assignee_roles', function(table) {
        table.increments('id').primary()
        table.string('title').notNull()
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable('assignee_roles')
}
