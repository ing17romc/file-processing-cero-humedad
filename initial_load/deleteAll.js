const getConnection = require('../db/mysql')
const CONSTANTS = require('../constants.js')

async function process () {
  console.log('BEGIN DELETE ALL')

  const conectionDB = await getConnection()

  try {
    await conectionDB.query('DELETE FROM Walmart_Productos;')
    await conectionDB.query('DELETE FROM CeroHumedad_Productos;')
    await conectionDB.query('DELETE FROM Walmart_Tiendas;')
    await conectionDB.query('DELETE FROM Walmart_TiposTiendas;')
    await conectionDB.query('DELETE FROM Walmart_Tabular;')

    await conectionDB.query('INSERT INTO Walmart_TiposTiendas (id, nombre, estado) VALUES (?,?,?)', [CONSTANTS.ITEM_DEFAULT.ID, CONSTANTS.ITEM_DEFAULT.NOMBRE, CONSTANTS.ITEM_DEFAULT.ESTADO])
    await conectionDB.query('INSERT INTO CeroHumedad_Productos (id, nombre, estado) VALUES (?,?,?)', [CONSTANTS.ITEM_DEFAULT.ID, CONSTANTS.ITEM_DEFAULT.NOMBRE, CONSTANTS.ITEM_DEFAULT.ESTADO])
  } catch (e) { console.log(e) } finally {
    conectionDB.end()
  }
}

process()
