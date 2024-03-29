require('dotenv').config()
const mongoose = require('mongoose')
const dbConnect = require('../')
const DEV = process.env.NODE_ENV !== 'p'
const collection = DEV ? 'AutoServicio_Log_DEV' : 'AutoServicio_Log_PROD'

const LogSchema = new mongoose.Schema({
  file: String,
  sheet: String,
  type: String,
  message: String,
  description: String
},
{
  timestamps: true
}, { collection })

const Log = mongoose.models.Log || mongoose.model('Log', LogSchema, collection)

const find = async () => {
  await dbConnect()

  const data = await Log.find({})

  return data
}
const save = async ({ file, sheet, type, message, description }) => {
  await dbConnect()

  const newData = new Log({ file, sheet, type, message, description })

  return await newData.save()
}
const findById = async (id) => {
  await dbConnect()

  const data = await Log.findOne({ _id: id })

  return data
}
const findByFile = async (file) => {
  await dbConnect()

  const data = await Log.findOne({ file })

  return data
}
const update = async ({ id, file, sheet, type, message, description }) => {
  await dbConnect()

  return await Log.updateOne({ _id: id }, { file, sheet, type, message, description }, {
    new: true,
    runValidators: true
  })
}
const deleteByFile = async (file) => {
  await dbConnect()

  return await Log.deleteMany({ file })
}
const deleteAll = async (files = []) => {
  await dbConnect()

  return await Log.deleteMany({ file: { $nin: files } })
}

module.exports = {
  find,
  save,
  findById,
  findByFile,
  update,
  deleteByFile,
  deleteAll
}
