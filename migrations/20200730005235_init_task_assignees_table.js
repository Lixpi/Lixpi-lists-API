
exports.up = function(knex) {
    return knex.schema.createTable('task_assignees', function(table) {
        table.increments('id').primary()
        table.integer('task_id').unsigned()
        table.foreign('task_id').references('tasks.id').onDelete('CASCADE')
        table.integer('user_id').unsigned()
        table.foreign('user_id').references('labels.id').onDelete('CASCADE')
        table.integer('assignee_role_id').unsigned()
        table.foreign('assignee_role_id').references('assignee_roles.id').onDelete('CASCADE')
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable('task_assignees')
}
