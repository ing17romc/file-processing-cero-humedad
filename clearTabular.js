const CONSTANTS = require('./constants.js')
const { descriptionException } = require('./utils')
const getConnection = require('./db/mysql')
const { save, deleteAll } = require('./db/mongodb/models/log')

const getSQLTabular = (files) => {
  let string = ''

  for (let index = 0; index < files.length; index++) {
    string += '"' + files[index] + '",'
  }

  const sql = 'DELETE FROM Walmart_Tabular WHERE archivo NOT IN (' + string.slice(0, -1) + ');'

  return sql
}

const getSQLTiendas = (files) => {
  let string = ''

  for (let index = 0; index < files.length; index++) {
    string += '"' + files[index] + '",'
  }

  const sql = 'DELETE FROM Walmart_Tiendas WHERE archivo NOT IN (' + string.slice(0, -1) + ');'

  return sql
}

module.exports = async function clearTabular (files) {
  console.log('BEGIN => clearTabular')

  const conectionDB = await getConnection()
  try {
    if (files.length > 0) {
      const SQLTabular = getSQLTabular(files)
      await conectionDB.query(SQLTabular)
      const SQLTiendas = getSQLTiendas(files)
      await conectionDB.query(SQLTiendas)
    }
    console.log('files', files)
    await deleteAll(files)
  } catch (e) {
    const description = descriptionException(e)
    await save({ sheet: 'N/A', type: CONSTANTS.TYPE_LOG.TABULAR, file: 'clear-tabular', message: e.message, description })
  } finally {
    conectionDB.end()
  }

  console.log('END   => clearTabular')
}
