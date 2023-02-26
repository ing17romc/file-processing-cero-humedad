const XLSX = require('xlsx')
const CONSTANTS = require('./constants.js')

function leerExcel (ruta) {
  const workbook = XLSX.readFile(ruta)
  const workbookSheets = workbook.SheetNames

  const sheet = workbookSheets[0]
  const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])

  for (let index = 21; index < 25; index++) {
    const element = dataExcel[index]
    // console.log(element)

    const codigoProducto = element.__EMPTY
    const codigoTienda = element.__EMPTY_8
    const precioVentaUnidad = element.__EMPTY_5
    const costoUnidad = element.__EMPTY_7
    const cantidadVendida = element.__EMPTY_18
    const totalPrecio = element.__EMPTY_19
    const inventario = element.__EMPTY_20

    console.log('codigoProducto', codigoProducto)
    console.log('codigoTienda', codigoTienda)
    console.log('precioVentaUnidad', precioVentaUnidad)
    console.log('costoUnidad', costoUnidad)
    console.log('cantidadVendida', cantidadVendida)
    console.log('totalPrecio', totalPrecio)
    console.log('inventario', inventario)
    console.log('')
  }
  console.log('END')
}

leerExcel(CONSTANTS.NAME_FILE)
