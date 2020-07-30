'use strict'

const projectGenerateNextSeqValProcedure = `
    CREATE OR REPLACE FUNCTION project_generate_next_sequence_val_procedure(_project_id integer) RETURNS TEXT AS $$
    DECLARE
    _project_key text;
    _next_value text;
    _value text;
    BEGIN
        SELECT projects.key
        INTO _project_key
        FROM projects
        WHERE projects.id = _project_id;

        SELECT project_sequences.next_value
        INTO _next_value
        FROM project_sequences
        WHERE project_sequences.project_key = _project_key;

        _value := CONCAT(_project_key, '-', _next_value);

        UPDATE project_sequences SET next_value = next_value + 1 WHERE project_key = _project_key;

        RETURN _value;
    END;
    $$ LANGUAGE plpgsql;
`

module.exports = { projectGenerateNextSeqValProcedure }