SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'lists'
  AND pid <> pg_backend_pid();

drop database lists;


create database lists;



knex migrate:make migration_name






SELECT c.relname FROM pg_class c WHERE c.relkind = 'S';



SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'lists'
  AND pid <> pg_backend_pid();
drop database lists;
create database lists;


SELECT project_generate_next_sequence_val_procedure("1SE")

SELECT project_generate_next_sequence_val_procedure(1)

select key from projects where id = 1




drop FUNCTION project_generate_next_sequence_val_procedure;
