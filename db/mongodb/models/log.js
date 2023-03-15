const mongoose = require('mongoose')
const dbConnect = require('../')

const LogSchema = new mongoose.Schema({
  file: String,
  type: String,
  message: String,
  description: String
})

const Log = mongoose.models.Log || mongoose.model('Log', LogSchema)

const find = async () => {
  await dbConnect()

  const data = await Log.find({})

  return data
}
const save = async ({ file, type, message, description }) => {
  await dbConnect()

  const newData = new Log({ file, type, message, description })

  return await newData.save()
}
const findById = async (id) => {
  await dbConnect()

  const data = await Log.findOne({ _id: id })

  return data
}
const update = async ({ id, file, type, message, description }) => {
  await dbConnect()

  return await Log.updateOne({ _id: id }, { file, type, message, description }, {
    new: true,
    runValidators: true
  })
}
const deleteByFile = async (file) => {
  await dbConnect()

  return await Log.deleteOne({ file })
}
const deleteAll = async () => {
  await dbConnect()

  return await Log.deleteMany()
}

module.exports = {
  find,
  save,
  findById,
  update,
  deleteByFile,
  deleteAll
}
