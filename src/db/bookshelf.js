const knex = require('knex')({
    client: 'pg',
    connection: {
        host     : 'localhost',
        user     : 'postgres',
        password : 'example',
        database : 'lists'
    }
})

const bookshelf = require('bookshelf')(knex)

module.exports = {
    knex, 
    bookshelf
}
