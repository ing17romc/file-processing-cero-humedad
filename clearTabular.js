const CONSTANTS = require('./constants.js')
const getConnection = require('./db/mysql')
const { save } = require('./db/mongodb/models/log')

const getSQL = (files) => {
  let string = ''

  for (let index = 0; index < files.length; index++) {
    string += '"' + files[index] + '",'
  }

  const sql = 'DELETE FROM Walmart_Tabular WHERE archivo NOT IN (' + string.slice(0, -1) + ');'

  return sql
}

module.exports = async function clearTabular (files) {
  console.log('BEGIN => clearTabular')

  const conectionDB = await getConnection()
  try {
    if (files.length > 0) {
      const SQL = getSQL(files)
      await conectionDB.query(SQL)
    }
  } catch (e) {
    console.log(e.message)
    await save({ type: CONSTANTS.TYPE_LOG.TABULAR, file: 'clear-tabular', message: e.message, description: e })
  } finally {
    conectionDB.end()
  }

  console.log('END   => clearTabular')
}
