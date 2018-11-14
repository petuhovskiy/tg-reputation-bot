const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema = new Schema({
    chatId: Number,
    message: String,
})

module.exports = schema
