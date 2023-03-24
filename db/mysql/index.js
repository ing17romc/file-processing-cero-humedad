
const DATABASE_URL = 'mysql://02roonqwoq3lsrmi4u45:pscale_pw_7UT4IYVGu7Adx9R9NeyCGDIQwTNRxxtltDex8s0XsLd@us-east.connect.psdb.cloud/autoservicios?ssl={"rejectUnauthorized":true}'
/*
const config = {
  host: 'localhost',
  user: 'admin',
  database: 'autoservicios',
  port: '3306',
  password: 'Password123#@!'
} */

module.exports = function getConnection () {
  try {
    const mysql = require('mysql2')

    // const pool = mysql.createPool(config)
    const pool = mysql.createPool(DATABASE_URL)

    const promisePool = pool.promise()

    return promisePool
  } catch (error) {
    return console.log(`Could not connect - ${error}`)
  }
}
