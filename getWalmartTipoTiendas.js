
const CONSTANTS = require('./constants.js')
const { descriptionException } = require('./utils')
const getConnection = require('./db/mysql')
const { save } = require('./db/mongodb/models/log')

module.exports = async function getWalmartTipoTiendas (ruta, sheet, dataExcel) {
  console.log('  BEGIN getWalmartTipoTiendas')

  const conectionDB = await getConnection()

  try {
    const [tiposTiendas] = await conectionDB.query('SELECT * FROM Walmart_TiposTiendas;')
    const ids = tiposTiendas.map(element => element.id)
    let i = Math.max(...ids) + 1
    const VALUES = []

    for (let index = CONSTANTS.START_ROW; index < dataExcel.length; index++) {
      const element = dataExcel[index]
      const nombre = element.__EMPTY_10

      if (nombre !== undefined && nombre !== '' && nombre !== null && !Number.isInteger(nombre)) {
        if (!tiposTiendas.some(element => element.nombre === nombre) && !VALUES.some(element => element[1] === nombre)) {
          // console.log(i, nombre)
          VALUES.push([i, nombre, 1])
          i++
        }
      }
    }

    if (VALUES.length !== 0) {
      console.log(VALUES)
      await conectionDB.query('INSERT INTO Walmart_TiposTiendas (id, nombre, estado) VALUES ?', [VALUES])
    }
  } catch (e) {
    const description = descriptionException(e)
    await save({ sheet, type: CONSTANTS.TYPE_LOG.TIPO_TIENDAS, file: ruta, message: e.message, description })
  } finally {
    conectionDB.end()
  }
}
