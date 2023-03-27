const fs = require('fs')
const CONSTANTS = require('../constants.js')

const descriptionException = (e) => {
  console.log(e)
  const description = (e.cause ? '[cause: ' + e.cause + '];    ' : '') +
  (e.columnNumber ? '[columnNumber: ' + e.columnNumber + '];    ' : '') +
  (e.fileName ? '[fileName: ' + e.fileName + '];    ' : '') +
  (e.lineNumber ? '[lineNumber: ' + e.lineNumber + '];    ' : '') +
  (e.name ? '[name: ' + e.name + '];    ' : '') +
  (e.stack ? '[stack: ' + e.stack + '];    ' : '') +
  (e.message ? '[message: ' + e.message + '];    ' : '')
  return description
}

const getExtension = (file) => file.slice(((file.lastIndexOf('.') - 1) + 2)).toLowerCase()

const readAllFiles = async (path, arrayOfFiles = []) => {
  const files = fs.readdirSync(path)

  files.forEach(file => {
    // console.log(file)
    const stat = fs.statSync(`${path}/${file}`)
    // console.log(stat, stat.isDirectory())
    if (stat.isDirectory()) {
      readAllFiles(`${path}/${file}`, arrayOfFiles)
    } else if (getExtension(file) === 'xlsx') {
      arrayOfFiles.push(`${path}/${file}`)
    }
  })

  return arrayOfFiles
}

const isFloat = (n) => {
  return Number(n) === n && n % 1 !== 0
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

const sliceArray = (arregloOriginal) => {
  const arregloDeArreglos = [] // Aquí almacenamos los nuevos arreglos
  // console.log("Arreglo original: ", arregloOriginal);
  // const LONGITUD_PEDAZOS = 3; // Partir en arreglo de 3
  for (let i = 0; i < arregloOriginal.length; i += CONSTANTS.LONGITUD_PEDAZOS) {
    const pedazo = arregloOriginal.slice(i, i + CONSTANTS.LONGITUD_PEDAZOS)
    arregloDeArreglos.push(pedazo)
  }
  // console.log('Arreglo de arreglos: ', arregloDeArreglos)
  return arregloDeArreglos
}

module.exports = {
  descriptionException,
  readAllFiles,
  isFloat,
  getDate,
  getYear,
  getWeekNumber,
  sliceArray
}
