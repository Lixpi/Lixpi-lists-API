const Sequelize = require('sequelize')
const { env } = require('../../config/node-config-loader')

const self = module.exports
let sequelize

/**
* Construct a singleton sequelize object to query the database
*
* @returns {object} - Sequelize object
*/
exports.initialize = () => {
    if (!sequelize) {
        const dbName = env.DATABASE_NAME
        const dbUsername = env.DATABASE_USERNAME
        const dbPassword = env.DATABASE_PASSWORD
        const dbHost = env.DATABASE_HOST
        const dbPort = env.DATABASE_PORT

        return new Sequelize(dbName, dbUsername, dbPassword, {
            host: dbHost,
            port: dbPort,
            dialect: 'postgres',
        })
    }

    return sequelize
}

module.exports = self.initialize()
