const utils = require("../lib/utils")
const msgs = require('./msg')

module.exports = bot => msg => {
    console.log("Outgoing message:", msg)
    if (msg.limit == 3) {
        bot.sendHTML(msg.chatId, msgs.errorSelfLike())
        return
    }
    if (msg.limit == 4) {
        bot.sendHTML(msg.chatId, msgs.errorAlreadyLikedUser())
        return
    }
    if (msg.limit == 2) {
        bot.sendHTML(msg.chatId, msgs.errorDailyUpLimit())
        return
    }
    if (msg.limit == 1) {
        bot.sendHTML(msg.chatId, msgs.errroDailyDownLimit())
        return
    }
    if (msg.limit == 5) {
        bot.sendHTML(msg.chatId, msgs.errorCantUp())
        return
    }
    if (msg.limit == 6) {
        bot.sendHTML(msg.chatId, msgs.errorInvalidUsername())
        return
    }
    if (msg.type == "stats") {
        bot.sendHTML(msg.chatId, msgs.getStatsMessage(msg.result, msg.page))
        return
    }
    bot.sendHTML(msg.chatId, msgs.getReputationInfo(msg.reputation))
}
