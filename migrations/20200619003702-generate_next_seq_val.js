'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(`
            CREATE OR REPLACE FUNCTION generate_next_seq_val(_project_key text, _sequence_name text) RETURNS TEXT AS $$
            DECLARE
            _prefix text;
            _next_value text;
            _zero_pad integer;
            _value text;
            BEGIN
            SELECT project_sequences.prefix, project_sequences.next_value, project_sequences.zero_pad
            INTO _prefix, _next_value, _zero_pad
            FROM project_sequences
            WHERE project_sequences.project_key = _project_key
                AND project_sequences.sequence_name = _sequence_name;

            IF _zero_pad IS NOT NULL THEN
                _value := lpad(_next_value, _zero_pad, '0');
            END IF;

            _value := CONCAT(_prefix, '-', _value);

            UPDATE project_sequences SET
                next_value = next_value + 1
            WHERE project_key = _project_key
                AND sequence_name = _sequence_name;

            RETURN _value;
            END;
            $$ LANGUAGE plpgsql;
        `)
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query('DROP FUNCTION generate_next_seq_val;')
    }
}
