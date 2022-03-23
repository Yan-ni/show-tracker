module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './showTracker_database.sqlite'
  },
  production: {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
}