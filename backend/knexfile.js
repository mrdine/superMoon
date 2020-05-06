// Update with your config settings.
require('dotenv').config()

module.exports = {
  
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
  
/*
  development: {
    client: 'pg',
    connection: {
      host : 'ec2-34-195-169-25.compute-1.amazonaws.com',
      user : 'axycklmdiahsee',
      password : '51cc42b80236cc8c833e0f83cdc84892d6f57d6878e5242c434801e60a646cc6',
      database : 'd2tp42hvt0bg7v'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true,
  },
*/
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
