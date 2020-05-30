const path = require('path')
const process = require('process')
const dotenv = require('dotenv')

// Loading config based on ENVIRONMENT variable, please refer to package.json
dotenv.config({ path: path.resolve(__dirname, `../config/${process.env.ENVIRONMENT}.env`)});

module.exports.env = process.env