include .env
export

PHP_PORT=8000
PSQL=psql -U $(DB_USER) -h $(DB_HOST) -p $(DB_PORT)

db:
	$(PSQL) -c "CREATE DATABASE $(DB_NAME);"

migrate:
	$(PSQL) -d $(DB_NAME) -f sql/schema.sql

serve:
	php -S localhost:$(PHP_PORT) -t public

setup: db migrate

query:
# get query name from command line, e.g. `make query name=selectAllProducts`
	$(PSQL) -d $(DB_NAME) -f sql/$(name).sql

.PHONY: db migrate serve setup