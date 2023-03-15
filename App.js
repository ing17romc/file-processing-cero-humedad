const XLSX = require('xlsx')
const CONSTANTS = require('./constants.js')
const getWalmartTiendas = require('./getWalmartTiendas.js')
const getWalmartProductos = require('./getWalmartProductos.js')
const getWalmartTabular = require('./getWalmartTabular.js')
const clearTabular = require('./clearTabular.js')
const fs = require('fs')

const getExtension = (file) => file.slice(((file.lastIndexOf('.') - 1) + 2)).toLowerCase()

const { save } = require('./db/mongodb/models/log')

async function readAllFiles (path, arrayOfFiles = []) {
  const files = fs.readdirSync(path)
  files.forEach(file => {
    const stat = fs.statSync(`${path}/${file}`)
    if (stat.isDirectory()) {
      readAllFiles(`${path}/${file}`, arrayOfFiles)
    } else if (getExtension(file) === 'xlsx') {
      arrayOfFiles.push(`${path}/${file}`)
    }
  }
  )
  return arrayOfFiles
}

async function leerExcel (ruta) {
  const workbook = XLSX.readFile(ruta)
  const workbookSheets = workbook.SheetNames

  console.log('BEGIN => ', ruta)

  for (const sheet of workbookSheets) {
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
    console.log('SHEET => ', sheet)
    try {
      await getWalmartTiendas(ruta, dataExcel)
      await getWalmartProductos(ruta, dataExcel)
      await getWalmartTabular(dataExcel, ruta)
    } catch (e) {
      console.log(e.message)
      await save({ type: CONSTANTS.TYPE_LOG.START, file: ruta, message: e.message, description: e })
    }
  }

  console.log('END =>   ', ruta)
}

async function main () {
  console.log('### STARTING ###')

  const files = await readAllFiles(CONSTANTS.PATH)

  await clearTabular(files)

  for (const iterator of files) {
    console.log('')
    await leerExcel(iterator)
  }

  console.log('### FINALIZED ###')
}

main()
