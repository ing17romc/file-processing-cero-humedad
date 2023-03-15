
const CONSTANTS = require('./constants.js')
const getConnection = require('./db/mysql')
const { save } = require('./db/mongodb/models/log')

module.exports = async function getWalmartProductos (ruta, dataExcel) {
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
      // const [rows] = await ('SELECT * FROM Walmart_Productos where nombre = "' + nombre + '";')
        if (!WalmartProductos.some(element => element.id === code) && !VALUES.some(element => element[0] === code)) {
          // if (rows.length === 0) {
          const idCH = CONSTANTS.ITEM_DEFAULT.ID
          console.log(code, nombre, idCH)
          VALUES.push([code, nombre, 1, idCH])
        // await conectionDB.query('INSERT INTO Walmart_Productos (id, nombre, estado, idCeroHumedadProducto) VALUES (?,?,?,?)', [code, nombre, 1, idCH])
        }
      }
    }

    if (VALUES.length !== 0) await conectionDB.query('INSERT INTO Walmart_Productos (id, nombre, estado, idCeroHumedadProducto) VALUES ? ', [VALUES])
  } catch (e) {
    if (e.message !== "Cannot read property 'Nuevo Semanal' of undefined") {
      console.log(e.message)
      await save({ type: CONSTANTS.TYPE_LOG.PRODUCTO, file: ruta, message: e.message, description: e })
    }
  } finally {
    conectionDB.end()
  }
  console.log('  END   getWalmartProductos')
}
