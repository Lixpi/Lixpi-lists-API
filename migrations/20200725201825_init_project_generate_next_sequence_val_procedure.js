const { projectGenerateNextSeqValProcedure } = require('../src/db/functions/project_generate_next_sequence_val_procedure')

exports.up = function(knex) {
    return knex.raw(projectGenerateNextSeqValProcedure)
}

exports.down = function(knex) {
    return knex.raw('DROP FUNCTION project_generate_next_sequence_val_procedure')
}
