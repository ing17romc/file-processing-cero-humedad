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

module.exports = {
  descriptionException
}
