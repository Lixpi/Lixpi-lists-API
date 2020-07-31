
exports.up = function(knex) {
    return knex.schema.createTable('task_labels', function(table) {
        table.increments('id').primary()
        table.integer('task_id').unsigned()
        table.foreign('task_id').references('tasks.id').onDelete('CASCADE')
        table.integer('label_id').unsigned()
        table.foreign('label_id').references('labels.id').onDelete('CASCADE')
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable('task_labels')
}
