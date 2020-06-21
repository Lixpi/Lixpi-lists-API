# Lixpi-lists-API

To run the project:
```
docker-compose -f docker-compose.builder.yml run --rm install
docker-compose up
```
To run the project in debug mode:
```
docker-compose -f docker-compose.builder.yml run --rm install
docker-compose -f docker-compose-debug.yml up
```


To re-create DB and sync models:
```
npm run dropDb
npm run createD
npm run syncModels
```
To run seeds:
```
npm run seedDb
```
To runMigrations:
```
npm run runMigrations
```


API documentation
https://lixpi.docs.apiary.io
