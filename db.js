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

reputationChangeSchema.statics.getStats = function(chatId, plus, minus, sort) {
    return this.aggregate(
        // Pipeline
        [
            // Stage 1
            {
                $match: {
                    chatId: -22628215
                }
            },
    
            // Stage 2
            {
                $group: {
                    _id: { username: "$username" },
                    value: { $sum: { $sum: [(plus - minus) / 2.0, {$multiply: ["$value", (plus + minus) / 2.0] }] } }
                }
            },
    
            // Stage 3
            {
                $sort: {
                    value: sort
                }
            },
        ]
        // Created with Studio 3T, the IDE for MongoDB - https://studio3t.com/
    ).exec();
}

reputationChangeSchema.statics.findByUsers = function(chatId, id, username) {
    return this.findOne({ chatId, id, username }).exec();
}

const ReputationChange = mongoose.model('ReputationChange', reputationChangeSchema);

module.exports = {
    Activity,
    ReputationChange
}