const db = require("../db")
const bot = require("../bot")
const utils = require("../lib/utils")
const msgs = require("../front/msg")

const revealLast10 = async (chatId, resp) => {
    const last = await db.ReputationChange.find({ chatId })
        .sort({ time: -1 })
        .limit(10)

    bot.sendMessage(resp, `Последние ${last.length} события в чате ${chatId}:`)

    for (let i = 0; i < last.length; i++) {
        const rep = last[i]
        bot.sendHTML(
            resp,
            `
${msgs.showRepChange(rep)}

<b>ID</b>: ${rep._id}
            `
        )
    }
}

module.exports = {
    revealLast10,
}
