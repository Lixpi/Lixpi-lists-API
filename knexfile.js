const { env } = require('./config/node-config-loader')

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      host: env.DATABASE_HOST,
      user: env.DATABASE_USERNAME,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_NAME,
      port: env.DATABASE_PORT
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      host: env.DATABASE_HOST,
      user: env.DATABASE_USERNAME,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_NAME,
      port: env.DATABASE_PORT
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: env.DATABASE_HOST,
      user: env.DATABASE_USERNAME,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_NAME,
      port: env.DATABASE_PORT
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
