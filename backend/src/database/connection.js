const knex = require('knex')
const configuration = require('../../knexfile')

const env = 'development'
const config = configuration[env]

const connection = knex(config)

module.exports = connection