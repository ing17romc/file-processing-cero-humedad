
const CONSTANTS = require('./constants.js')
const { descriptionException, isFloat, sliceArray } = require('./utils')
const getConnection = require('../db/mysql')
const { save } = require('../db/mongodb/models/log')

module.exports = async function getWalmartTiendas (ruta, sheet, dataExcel) {
  console.log('  BEGIN getWalmartTiendas')

  const conectionDB = await getConnection()

  try {
    const [tiposTiendas] = await conectionDB.query('SELECT * FROM Walmart_TiposTiendas;')
    const [tienda] = await conectionDB.query('SELECT * FROM Walmart_Tiendas;')

    const VALUES = []

    for (let index = CONSTANTS.START_ROW; index < dataExcel.length; index++) {
      const element = dataExcel[index]

      const code = element.__EMPTY_8
      const nombre = element.__EMPTY_9
      const tipo = element.__EMPTY_10
      const localidad = element.__EMPTY_11
      const cp = element.__EMPTY_12

      const found = tiposTiendas.find(element => element.nombre === tipo)

      if (nombre !== undefined && nombre !== '' && nombre !== null && !Number.isInteger(nombre) && !isFloat(nombre)) {
        if (!tienda.some(element => element.id === code) && !VALUES.some(element => element[0] === code)) {
          const idTipo = found !== undefined ? found.id : CONSTANTS.ITEM_DEFAULT.ID

          // console.log([code, nombre, 1, idTipo, cp, localidad])

          VALUES.push([code, nombre, 1, idTipo, cp, localidad, ruta])
        }
      }
    }

    if (VALUES.length !== 0) {
      console.log('ROWS', VALUES.length)

      const ARRAY = sliceArray(VALUES)

      for (const values of ARRAY) {
        await conectionDB.query('INSERT INTO Walmart_Tiendas (id, nombre, estado, idTipo, codigoPostal, localidad, archivo) VALUES ?', [values])
      }
    }
  } catch (e) {
    const description = descriptionException(e)
    await save({ sheet, type: CONSTANTS.TYPE_LOG.TIENDA, file: ruta, message: e.message, description })
  } finally {
    conectionDB.end()
  }
}
