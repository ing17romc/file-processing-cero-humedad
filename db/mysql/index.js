require('dotenv').config()

const configLocalhost = { host: 'localhost', user: 'admin', database: 'autoservicios', port: '3306', password: 'Password123#@!' }

module.exports = function getConnection () {
  const DEV = process.env.NODE_ENV !== 'prod'
  console.log('process.env.NODE_ENV', process.env.NODE_ENV)
  try {
    const mysql = require('mysql2')

    const config = DEV ? configLocalhost : process.env.DATABASE_URL

    const pool = mysql.createPool(config)

    const promisePool = pool.promise()

    return promisePool
  } catch (error) {
    return console.log(`Could not connect - ${error}`)
  }
}
