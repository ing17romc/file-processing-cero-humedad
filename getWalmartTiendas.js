
const CONSTANTS = require('./constants.js')
const getConnection = require('./conectionDB')

function isFloat (n) {
  return Number(n) === n && n % 1 !== 0
}

module.exports = async function getWalmartTiendas (dataExcel) {
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
      // const [rows] = await conectionDB.query('SELECT * FROM Walmart_Tiendas where nombre = "' + nombre + '";')
        if (!tienda.some(element => element.id === code) && !VALUES.some(element => element[0] === code)) {
          const idTipo = found !== undefined ? found.id : CONSTANTS.ITEM_DEFAULT.ID

          console.log([code, nombre, 1, idTipo, cp, localidad])

          VALUES.push([code, nombre, 1, idTipo, cp, localidad])
        }
      }
    }
    if (VALUES.length !== 0) await conectionDB.query('INSERT INTO Walmart_Tiendas (id, nombre, estado, idTipo, codigoPostal, localidad) VALUES ?', [VALUES])
  } catch (e) { console.log(e.message) } finally {
    conectionDB.end()
  }
  console.log('  END   getWalmartTiendas')
}
