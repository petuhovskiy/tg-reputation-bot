const mongoose = require('mongoose')
const Schema = mongoose.Schema

// init

const url = process.env.MONGO_DB;
mongoose.connect(url);

const db = mongoose.connection;

// Activity
const activitySchema = new Schema({
    id: Number,
    chatId: Number,
    plus: Number,
    minus: Number,
    last: Number
});

activitySchema.statics.findByUserId = function(chatId, id) { 
    return this.findOne({ id, chatId }).exec();
}

const Activity = mongoose.model('Activity', activitySchema);

// ReputationChange
const reputationChangeSchema = new Schema({
    id: Number,
    chatId: Number,
    username: String,
    value: Number
})

reputationChangeSchema.statics.countReputationByValue = function(chatId, username, value) {
    return this.count({ chatId, username, value }).exec();
}

reputationChangeSchema.statics.countReputation = async function(chatId, username) {
    return {
        plus: await this.countReputationByValue(chatId, username, 1),
        minus: await this.countReputationByValue(chatId, username, -1)
    }
}

reputationChangeSchema.statics.findByUsers = function(chatId, id, username) {
    return this.findOne({ chatId, id, username }).exec();
}

const ReputationChange = mongoose.model('ReputationChange', reputationChangeSchema);

module.exports = {
    Activity,
    ReputationChange
}