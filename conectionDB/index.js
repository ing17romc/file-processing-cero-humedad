
module.exports = function getConnection () {
  try {
    const mysql = require('mysql2')

    const config = {
      host: 'localhost',
      user: 'admin',
      database: 'autoservicios',
      port: '3306',
      password: 'Password123#@!'
    }

    const pool = mysql.createPool(config)

    const promisePool = pool.promise()

    return promisePool
  } catch (error) {
    return console.log(`Could not connect - ${error}`)
  }
}
