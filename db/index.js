const mongoose = require("mongoose")
const Schema = mongoose.Schema

const url = process.env.MONGO_DB
mongoose.connect(url)
const db = mongoose.connection

const Activity = mongoose.model("Activity", require("./activity"))
const ReputationChange = mongoose.model(
    "ReputationChange",
    require("./reputationChange")
)
const Reputation = mongoose.model("Reputation", require("./reputation"))
const Message = mongoose.model("Message", new Schema({}, { strict: false }))
const saveMessage = msg => new Message(msg).save()
const RepEvent = mongoose.model("RepEvent", new Schema({}, { strict: false }))
const saveEvent = ev => new RepEvent(ev).save()

module.exports = {
    Activity,
    ReputationChange,
    Reputation,
    Message,
    saveMessage,
    RepEvent,
    saveEvent,
}
