const XLSX = require('xlsx')
const CONSTANTS = require('./constants.js')
const { descriptionException, readAllFiles } = require('./utils')
const getWalmartTiendas = require('./getWalmartTiendas.js')
const getWalmartProductos = require('./getWalmartProductos.js')
const getWalmartTabular = require('./getWalmartTabular.js')
const clearTabular = require('./clearTabular.js')
const getConnection = require('../db/mysql')

const { save, findByFile, deleteByFile } = require('../db/mongodb/models/log')

async function leerExcel (ruta) {
  const workbook = XLSX.readFile(ruta)
  const workbookSheets = workbook.SheetNames

  console.log('BEGIN => ', ruta)

  for (const sheet of workbookSheets) {
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
    console.log('SHEET => ', sheet)
    try {
      await getWalmartTiendas(ruta, sheet, dataExcel)
      await getWalmartProductos(ruta, sheet, dataExcel)
      await getWalmartTabular(ruta, sheet, dataExcel)
    } catch (e) {
      const description = descriptionException(e)
      await save({ sheet, type: CONSTANTS.TYPE_LOG.START, file: ruta, message: e.message, description })
    }
  }

  console.log('END =>   ', ruta)
}

async function main () {
  console.log('### STARTING ###')

  const files = await readAllFiles(CONSTANTS.PATH)
  const conectionDB = await getConnection()

  await clearTabular(files)

  for (const file of files) {
    const log = await findByFile(file)
    const [tabular] = await conectionDB.query('SELECT * FROM Walmart_Tabular where archivo = "' + file + '" LIMIT 1;')
    // const [tiendas] = await conectionDB.query('SELECT * FROM Walmart_Tiendas where archivo = "' + file + '" LIMIT 1;')
    // si se encuentra en log o no esta en tabular procesar
    if (!!log || tabular.length === 0) {
      console.log(file)

      await deleteByFile(file)
      await conectionDB.query('DELETE FROM Walmart_Tiendas where archivo = "' + file + '";')
      await conectionDB.query('DELETE FROM Walmart_Tabular where archivo = "' + file + '";')

      await leerExcel(file)
    } else console.log('ARCHIVO PROCESADO', file)
  }

  console.log('### FINALIZED ###')
}

main()
