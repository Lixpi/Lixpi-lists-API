require('dotenv').config();
 
const Sequelize = require('sequelize');

const self = module.exports;
let sequelize;

/**
 * Construct a singleton sequelize object to query the database
 * 
 * @returns {object} - Sequelize object
 */
exports.initialize = () => {
  if (!sequelize) {
    const dbName = process.env.DATABASE_NAME;
    const dbUsername = process.env.DATABASE_USERNAME;
    const dbPassword = process.env.DATABASE_PASSWORD;
    const dbHost = process.env.DATABASE_HOST;
    const dbPort = process.env.DATABASE_PORT;
    return new Sequelize(dbName, dbUsername, dbPassword, {
      host: dbHost,
      port: dbPort,
      dialect: 'postgres',
    });
  }

  return sequelize;
};

module.exports = self.initialize();
