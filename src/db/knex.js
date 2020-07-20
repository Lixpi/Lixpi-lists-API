const { env } = require('../../config/node-config-loader')

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: env.DATABASE_HOST,
        user: env.DATABASE_USERNAME,
        password: env.DATABASE_PASSWORD,
        database: env.DATABASE_NAME,
        port: env.DATABASE_PORT
    }
})

module.exports = {
    knex
}
