'use strict'

module.exports.generateNextSeqVal = `
    CREATE OR REPLACE FUNCTION generate_next_seq_val(_project_key text, _sequence_name text) RETURNS TEXT AS $$
    DECLARE
    _prefix text;
    _next_value text;
    _value text;
    BEGIN
    SELECT project_sequences.prefix, project_sequences.next_value
    INTO _prefix, _next_value
    FROM project_sequences
    WHERE project_sequences.project_key = _project_key
        AND project_sequences.sequence_name = _sequence_name;
    
    _value := CONCAT(_prefix, '-', _next_value);
    
    UPDATE project_sequences SET
        next_value = next_value + 1
    WHERE project_key = _project_key
        AND sequence_name = _sequence_name;
    
    RETURN _value;
    END;
    $$ LANGUAGE plpgsql;
`
