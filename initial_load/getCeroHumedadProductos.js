const XLSX = require('xlsx')
const getConnection = require('../db/mysql')
const { FILINITIAL_LOAD_FILE, START_ROW } = require('../constants.js')

async function process () {
  console.log('BEGIN getCeroHumedadProductos ' + FILINITIAL_LOAD_FILE.NAME + ' - ' + FILINITIAL_LOAD_FILE.SHEET)

  const conectionDB = await getConnection()
  try {
    const workbook = XLSX.readFile(FILINITIAL_LOAD_FILE.NAME)
    const workbookSheets = workbook.SheetNames

    const sheet = workbookSheets[FILINITIAL_LOAD_FILE.SHEET]
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])

    const [rows] = await conectionDB.query('SELECT * FROM CeroHumedad_Productos;')
    const ids = rows.map(element => element.id)
    let i = Math.max(...ids) + 1
    const VALUES = []

    for (let index = START_ROW; index < dataExcel.length; index++) {
      const element = dataExcel[index]
      const nombre = element.__EMPTY_1

      if (nombre !== undefined && nombre !== '' && nombre !== null) {
        if (!rows.some(element => element.nombre === nombre) && !VALUES.some(element => element[1] === nombre)) {
          console.log(i, nombre)
          VALUES.push([i, nombre, 1])
          i++
        }
      }
    }
    if (VALUES.length !== 0) await conectionDB.query('INSERT INTO CeroHumedad_Productos (id, nombre, estado) VALUES ?', [VALUES])
  } catch (e) { console.log(e) } finally {
    conectionDB.end()
  }
  console.log('END   getCeroHumedadProductos')
}

process()
