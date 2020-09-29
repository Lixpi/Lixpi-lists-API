
exports.up = function(knex) {
    return knex.schema.createTable('task_versions', function(table) {
        table.increments('id').primary()
        table.integer('task_id').unsigned()
        table.foreign('task_id').references('tasks.id').onDelete('CASCADE')
        table.integer('version_id').unsigned()
        table.foreign('version_id').references('versions.id').onDelete('CASCADE')
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable('task_versions')
}
