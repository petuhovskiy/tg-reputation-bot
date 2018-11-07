const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema = new Schema({
    id: Number,
    chatId: Number,
    username: String,
    value: Number,
    time: Number,
})

schema.statics.findByUsers = function(chatId, id, username, value) {
    return this.find({ chatId, id, username, value })
        .sort({ time: -1 })
        .limit(1)
        .exec()
        .then(arr => arr[0])
}

schema.statics.findAll = function() {
    return this.find({}).exec()
}

module.exports = schema
