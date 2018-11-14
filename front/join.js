const utils = require("../lib/utils")
const msgs = require("./msg")
const db = require('../db')

module.exports = bot => {
    bot.on("message", msg => {
        const chatId = msg.chat.id
        if (
            msg.new_chat_member
        ) {
            if (msg.new_chat_member.username == process.env.BOT_USERNAME) {
                bot.sendHTML(chatId, msgs.helpBot())
            } else {
                (async () => {
                    const welcome = await db.Welcome.findOne({chatId})
                    if (welcome) {
                        bot.sendHTML(chatId, welcome.message)
                    }
                })()
            }
        }
    })
}
