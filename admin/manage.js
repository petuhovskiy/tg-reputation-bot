const db = require("../db")
const bot = require("../bot")
const utils = require("../lib/utils")

const revealLast10 = async (chatId, resp) => {
    const last = await db.ReputationChange.find({ chatId })
        .sort({ time: -1 })
        .limit(10)

    bot.sendMessage(resp, `Последние ${last.length} события в чате ${chatId}:`)

    for (let i = 0; i < last.length; i++) {
        const rep = last[i]
        bot.sendMessage(
            resp,
            `
Изменение от <a href="tg://user?id=${rep.id}">юзера</a>:
Репутация @${rep.username} изменилась на <b>${rep.value}</b>
<b>ID</b>: ${rep._id}`,
            { parse_mode: "HTML" }
        )
    }
}

module.exports = {
    revealLast10,
}