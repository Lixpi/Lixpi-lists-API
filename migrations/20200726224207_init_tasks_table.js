
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
        table.integer('priority_id').unsigned()
        table.foreign('priority_id').references('priorities.id').onDelete('SET NULL')
        table.integer('type_id').unsigned()
        table.foreign('type_id').references('types.id').onDelete('SET NULL')
        table.integer('status_id').unsigned()
        table.foreign('status_id').references('statuses.id').onDelete('SET NULL')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable('tasks')
}
