/* eslint-disable no-extend-native */

const CONSTANTS = require('./constants.js')
const getConnection = require('./conectionDB')

Date.prototype.getWeekNumber = function () {
  const d = new Date(+this) // Creamos un nuevo Date con la fecha de "this".
  d.setHours(0, 0, 0, 0) // Nos aseguramos de limpiar la hora.
  d.setDate(d.getDate() + 4 - (d.getDay() || 7)) // Recorremos los días para asegurarnos de estar "dentro de la semana"
  // Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
  return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7)
}

const getDate = (date) => {
  // console.log(date)

  const month = date.substring(0, 2)
  // console.log(month)

  const day = date.substring(3, 5)
  // console.log(day)

  const year = date.substring(6)
  // console.log(year)

  // console.log(year, month, day)

  // const DATE = new Date(year, Number(month)-1, day);

  // console.log(DATE)

  // console.log(DATE.getWeekNumber());
  // console.log(DATE.getFullYear())
  // console.log( year+'-'+month+'-'+day)

  return year + '-' + month + '-' + day
}

const getYear = (date) => {
  // console.log(date)

  const month = date.substring(0, 2)
  // console.log(month)

  const day = date.substring(3, 5)
  // console.log(day)

  const year = date.substring(6)
  // console.log(year)

  // console.log(year, month, day)

  const DATE = new Date(year, Number(month) - 1, day)

  // console.log(DATE)

  // console.log(DATE.getWeekNumber());
  // console.log(DATE.getFullYear())
  // console.log( year+'-'+month+'-'+day)
  return DATE.getFullYear()
}
const getWeekNumber = (date) => {
  // console.log(date)

  const month = date.substring(0, 2)
  // console.log(month)

  const day = date.substring(3, 5)
  // console.log(day)

  const year = date.substring(6)
  // console.log(year)

  // console.log(year, month, day)

  const DATE = new Date(year, Number(month) - 1, day)

  // console.log(DATE)

  // console.log(DATE.getWeekNumber());
  // console.log(DATE.getFullYear())
  // console.log( year+'-'+month+'-'+day)
  return DATE.getWeekNumber()
}

module.exports = async function getWalmartTabular (dataExcel, archivo) {
  console.log('  BEGIN getWalmartTabular')
  const conectionDB = await getConnection()
  try {
    const [rows] = await conectionDB.query('SELECT * FROM Walmart_Tabular where archivo = "' + archivo + '";')

    if (rows.length === 0) {
      const fechas = dataExcel[10]['Nuevo Semanal']

      // console.log(fechas)

      const fechaDesde = fechas.substring(46, 56)

      // console.log(fechaDesde);

      const fechaHasta = fechas.substring(61, 71)

      const FECHA_DESDE = getDate(fechaDesde)
      const FECHA_HASTA = getDate(fechaHasta)

      const SEMANA = getWeekNumber(fechaDesde)
      const ANIO = getYear(fechaDesde)

      // await promisePool.query('DELETE FROM Walmart_Tabular;');

      const VALUES = []

      const hoy = new Date()

      for (let index = CONSTANTS.START_ROW; index < dataExcel.length; index++) {
        const element = dataExcel[index]
        const codigoProducto = element.__EMPTY
        const codigoTienda = element.__EMPTY_8
        const precioVentaUnidad = element.__EMPTY_5
        const costoUnidad = element.__EMPTY_7
        const cantidadVendida = element.__EMPTY_18
        const totalPrecio = element.__EMPTY_19
        const inventario = element.__EMPTY_20

        if (codigoProducto !== undefined && codigoProducto !== '' && codigoProducto !== null && (cantidadVendida !== 0 || inventario !== 0)) {
          VALUES.push([codigoProducto, codigoTienda, precioVentaUnidad, costoUnidad, cantidadVendida, totalPrecio, inventario, SEMANA, ANIO, FECHA_DESDE, FECHA_HASTA, archivo, hoy])
        }
      }

      await conectionDB.query('INSERT INTO Walmart_Tabular (codigoProducto, codigoTienda, precioVentaUnidad, costoUnidad, cantidadVendida, totalPrecio, inventario, semana, anio, fechaDesde, fechaHasta, archivo, fechaRegistro) VALUES ?', [VALUES])
    } else console.log('   It already exists')
  } catch (e) { console.log(e.message) } finally {
    conectionDB.end()
  }
  console.log('  END   getWalmartTabular')
}
