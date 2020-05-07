// Update with your config settings.
require('dotenv').config()
const pg = require('pg')
pg.defaults.ssl = true
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

module.exports = {
  /*
    development: {
      client: 'sqlite3',
      connection: {
        filename: './src/database/db.sqlite'
      },
      migrations: {
        directory: './src/database/migrations'
      },
      useNullAsDefault: true,
    },
  */

  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true,
  },

  testing: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true,
  },


  staging: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './src/database/migrations'
    },
  }

};
