const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema = new Schema({
    chatId: Number,
    username: String,
    value: Number,
    plus: Number,
    minus: Number,
})

schema.statics.countReputation = async function(chatId, username) {
    return this.findOne({ chatId, username }).exec()
}

schema.statics.getStats = function(chatId, sort) {
    return this.find({ chatId })
        .sort({ value: sort })
        .exec()
}

schema.statics.findAll = function() {
    return this.find({}).exec()
}

module.exports = schema
