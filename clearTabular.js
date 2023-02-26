const getConnection = require('./conectionDB')

const getSQL = (files) => {
  let string = ''

  for (let index = 0; index < files.length; index++) {
    string += '"' + files[index] + '",'
  }

  const sql = 'DELETE FROM Walmart_Tabular WHERE archivo NOT IN (' + string.slice(0, -1) + ');'
  // const sql = 'DELETE FROM Walmart_Tabular;'
  // console.log(sql)
  return sql
}

module.exports = async function clearTabular (files) {
  console.log('BEGIN => clearTabular')

  const conectionDB = await getConnection()
  try {
    if (files.length > 0) {
      const SQL = getSQL(files)
      // console.log(SQL)
      await conectionDB.query(SQL)
    }
  } catch (e) { console.log(e.message) } finally {
    conectionDB.end()
  }

  console.log('END   => clearTabular')
}
