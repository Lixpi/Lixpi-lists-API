const knex = require('knex')({
    client: 'pg',
    connection: {
        host     : 'localhost',
        user     : 'postgres',
        password : 'example',
        database : 'lists'
    }
})
module.exports = require('bookshelf')(knex)
