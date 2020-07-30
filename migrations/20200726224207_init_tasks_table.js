
exports.up = function(knex) {
    return knex.schema.createTable('tasks', function(table) {
        table.increments('id').primary()
        table.string('key').notNull()
        table.unique('key')
        table.string('title').notNull()
        table.string('description')
        table.string('version')
        table.integer('time_estimated').unsigned()
        table.integer('time_spent').unsigned()
        table.date('due_at')
        table.integer('author_id').unsigned()
        table.foreign('author_id').references('users.id').onDelete('SET NULL')
        table.integer('project_id').unsigned().notNull()
        table.foreign('project_id').references('projects.id').onDelete('CASCADE')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable('tasks')
}
