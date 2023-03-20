/* eslint-disable no-extend-native */

const CONSTANTS = require('./constants.js')
const { descriptionException } = require('./utils')
const getConnection = require('./db/mysql')
const { save } = require('./db/mongodb/models/log')

Date.prototype.getWeekNumber = function () {
  const d = new Date(+this)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7)
}

const getDate = (date) => {
  const month = date.substring(0, 2)
  const day = date.substring(3, 5)
  const year = date.substring(6)
  return year + '-' + month + '-' + day
}

const getYear = (date) => {
  const month = date.substring(0, 2)
  const day = date.substring(3, 5)
  const year = date.substring(6)
  const DATE = new Date(year, Number(month) - 1, day)
  return DATE.getFullYear()
}
const getWeekNumber = (date) => {
  const month = date.substring(0, 2)
  const day = date.substring(3, 5)
  const year = date.substring(6)
  const DATE = new Date(year, Number(month) - 1, day)
  return DATE.getWeekNumber()
}

module.exports = async function getWalmartTabular (ruta, sheet, dataExcel) {
  console.log('  BEGIN getWalmartTabular')
  const conectionDB = await getConnection()
  try {
    const [rows] = await conectionDB.query('SELECT * FROM Walmart_Tabular where archivo = "' + ruta + '";')

    if (rows.length === 0) {
      const fechas = dataExcel[10]['Nuevo Semanal']

      const fechaDesde = fechas.substring(46, 56)

      const fechaHasta = fechas.substring(61, 71)

      const FECHA_DESDE = getDate(fechaDesde)
      const FECHA_HASTA = getDate(fechaHasta)

      const SEMANA = getWeekNumber(fechaDesde)
      const ANIO = getYear(fechaDesde)

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
          VALUES.push([codigoProducto, codigoTienda, precioVentaUnidad, costoUnidad, cantidadVendida, totalPrecio, inventario, SEMANA, ANIO, FECHA_DESDE, FECHA_HASTA, ruta, hoy])
        }
      }

      await conectionDB.query('INSERT INTO Walmart_Tabular (codigoProducto, codigoTienda, precioVentaUnidad, costoUnidad, cantidadVendida, totalPrecio, inventario, semana, anio, fechaDesde, fechaHasta, archivo, fechaRegistro) VALUES ?', [VALUES])
    } else console.log('   It already exists')
  } catch (e) {
    if (e.message !== "Cannot read property 'Nuevo Semanal' of undefined") {
      const description = descriptionException(e)
      await save({ sheet, type: CONSTANTS.TYPE_LOG.TABULAR, file: ruta, message: e.message, description })
    }
  } finally {
    conectionDB.end()
  }
}
