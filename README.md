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
To truncate and sync models:
```
npm run dbInit
```

API documentation

https://lixpi.docs.apiary.io
