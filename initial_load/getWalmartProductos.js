const XLSX = require('xlsx')
const getConnection = require('../conectionDB')
const { FILINITIAL_LOAD_FILE, START_ROW, ITEM_DEFAULT } = require('../constants.js')

async function process () {
  console.log('BEGIN getWalmartProductos ' + FILINITIAL_LOAD_FILE.NAME + ' - ' + FILINITIAL_LOAD_FILE.SHEET)

  const conectionDB = await getConnection()
  try {
    const workbook = XLSX.readFile(FILINITIAL_LOAD_FILE.NAME)
    const workbookSheets = workbook.SheetNames

    const sheet = workbookSheets[FILINITIAL_LOAD_FILE.SHEET]
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])

    const [CeroHumedadProductos] = await conectionDB.query('SELECT * FROM CeroHumedad_Productos;')
    const [WalmartProductos] = await conectionDB.query('SELECT * FROM Walmart_Productos;')

    const VALUES = []

    for (let index = START_ROW; index < dataExcel.length; index++) {
      const element = dataExcel[index]
      const code = element.__EMPTY
      const nombre = element.Semanal
      const nombre2 = element.__EMPTY_1

      const productsCH = CeroHumedadProductos.find(element => element.nombre === nombre2)

      if (nombre !== undefined && nombre !== '' && nombre !== null) {
        if (!WalmartProductos.some(element => element.nombre === nombre) && !VALUES.some(element => element[1] === nombre)) {
          const idCH = productsCH ? productsCH.id : ITEM_DEFAULT.ID
          console.log(code, nombre, productsCH)
          VALUES.push([code, nombre, 1, idCH])
        }

        // const [rows] = await conectionDB.query('SELECT * FROM Walmart_Productos where nombre = "' + nombre + '";')
        // const [rows2] = await conectionDB.query('SELECT id FROM CeroHumedad_Productos where nombre = "' + nombre2 + '";')

      // console.log(index, rows.length, idCH)
      // if (rows.length === 0) {
      // console.log(code, nombre, nombre2)
      // await conectionDB.query('INSERT INTO Walmart_Productos (id, nombre, estado, idCeroHumedadProducto) VALUES (?,?,?,?)', [code, nombre, 1, rows2[0].id])
      // }
      }
    }
    if (VALUES.length !== 0) await conectionDB.query('INSERT INTO Walmart_Productos (id, nombre, estado, idCeroHumedadProducto) VALUES ? ', [VALUES])
  } catch (e) { console.log(e.message) } finally {
    conectionDB.end()
  }
  console.log('END   getWalmartProductos')
}

process()
