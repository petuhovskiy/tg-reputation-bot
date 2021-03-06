const utils = require("../lib/utils")
const msgs = require('./msg')

module.exports = bot => msg => {
    console.log("Outgoing message:", msg)
    if (msg.limit == 3) {
        utils.deleteLater(
            bot.sendHTML(msg.chatId, msgs.errorSelfLike())
        )
        return
    }
    if (msg.limit == 4) {
        utils.deleteLater(
            bot.sendHTML(msg.chatId, msgs.errorAlreadyLikedUser())
        )
        return
    }
    if (msg.limit == 2) {
        utils.deleteLater(
            bot.sendHTML(msg.chatId, msgs.errorDailyUpLimit())
        )
        return
    }
    if (msg.limit == 1) {
        utils.deleteLater(
            bot.sendHTML(msg.chatId, msgs.errroDailyDownLimit())
        )
        return
    }
    if (msg.limit == 5) {
        utils.deleteLater(
            bot.sendHTML(msg.chatId, msgs.errorCantUp())
        )
        return
    }
    if (msg.limit == 6) {
        utils.deleteLater(
            bot.sendHTML(msg.chatId, msgs.errorInvalidUsername())
        )
        return
    }
    if (msg.type == "stats") {
        bot.sendHTML(msg.chatId, msgs.getStatsMessage(msg.result, msg.page))
        return
    }
    utils.deleteLater(
        bot.sendHTML(msg.chatId, msgs.getReputationInfo(msg.reputation))
    )
}
