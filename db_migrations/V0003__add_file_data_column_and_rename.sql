ALTER TABLE t_p45427290_neural_network_qa.files 
ADD COLUMN file_data BYTEA;

ALTER TABLE t_p45427290_neural_network_qa.files 
RENAME COLUMN filename TO file_name;