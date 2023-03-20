
const CONSTANTS = require('./constants.js')
const { descriptionException } = require('./utils')
const getConnection = require('./db/mysql')
const { save } = require('./db/mongodb/models/log')

module.exports = async function getWalmartProductos (ruta, sheet, dataExcel) {
  console.log('  BEGIN getWalmartProductos')

  const conectionDB = await getConnection()

  try {
    const [WalmartProductos] = await conectionDB.query('SELECT * FROM Walmart_Productos;')

    const VALUES = []

    for (let index = CONSTANTS.START_ROW; index < dataExcel.length; index++) {
      const element = dataExcel[index]
      const code = element.__EMPTY
      const nombre = element.Semanal

      if (nombre !== undefined && nombre !== '' && nombre !== null) {
        if (!WalmartProductos.some(element => element.id === code) && !VALUES.some(element => element[0] === code)) {
          const idCH = CONSTANTS.ITEM_DEFAULT.ID
          // console.log(code, nombre, idCH)
          VALUES.push([code, nombre, 1, idCH])
        }
      }
    }

    if (VALUES.length !== 0) {
      console.log(VALUES)
      await conectionDB.query('INSERT INTO Walmart_Productos (id, nombre, estado, idCeroHumedadProducto) VALUES ? ', [VALUES])
    }
  } catch (e) {
    if (e.message !== "Cannot read property 'Nuevo Semanal' of undefined") {
      const description = descriptionException(e)
      await save({ sheet, type: CONSTANTS.TYPE_LOG.PRODUCTO, file: ruta, message: e.message, description })
    }
  } finally {
    conectionDB.end()
  }
}
