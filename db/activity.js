const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema = new Schema({
    id: Number,
    chatId: Number,
    plus: Number,
    minus: Number,
    last: Number,
})

schema.statics.findByUserId = function(chatId, id) {
    return this.findOne({ id, chatId }).exec()
}

module.exports = schema
