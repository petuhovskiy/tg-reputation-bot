const mongoose = require('mongoose')
const Schema = mongoose.Schema

// init

const url = process.env.MONGO_DB;
console.log(url);
mongoose.connect(url);

const db = mongoose.connection;

// Activity
const activitySchema = new Schema({
    id: Number,
    plus: Number,
    minus: Number,
    last: Number
});

activitySchema.statics.findByUserId = function(id) { 
    return this.findOne({ id }).exec();
}

const Activity = mongoose.model('Activity', activitySchema);

// ReputationChange
const reputationChangeSchema = new Schema({
    id: Number,
    username: String,
    value: Number
})

reputationChangeSchema.statics.countReputationByValue = function(username, value) {
    return this.count({ username, value }).exec();
}

reputationChangeSchema.statics.countReputation = async function(username) {
    return {
        plus: await this.countReputationByValue(username, 1),
        minus: await this.countReputationByValue(username, -1)
    }
}

reputationChangeSchema.statics.findByUsers = function(id, username) {
    return this.findOne({ id, username }).exec();
}


const ReputationChange = mongoose.model('ReputationChange', reputationChangeSchema);

module.exports = {
    Activity,
    ReputationChange
}