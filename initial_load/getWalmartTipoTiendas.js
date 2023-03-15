const XLSX = require('xlsx')
const getWalmartTipoTiendas = require('../getWalmartTipoTiendas')
const { FILINITIAL_LOAD_FILE } = require('../constants.js')

async function main () {
  console.log('BEGIN getWalmartTipoTiendas ' + FILINITIAL_LOAD_FILE.NAME + ' - ' + FILINITIAL_LOAD_FILE.SHEET)

  const workbook = XLSX.readFile(FILINITIAL_LOAD_FILE.NAME)
  const workbookSheets = workbook.SheetNames

  const sheet = workbookSheets[FILINITIAL_LOAD_FILE.SHEET]
  const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])

  await getWalmartTipoTiendas(FILINITIAL_LOAD_FILE.NAME, dataExcel)

  console.log('END   getWalmartTipoTiendas')
}

main()
