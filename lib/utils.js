const bot = require('../bot')

const getDate = d => new Date(d).toDateString()

const isEqualDays = (a, b) => getDate(a) == getDate(b)

const trimMessage = msg =>
    msg
        .split("\n")
        .map(it => it.trim())
        .join("\n")

const deleteLater = async p => {
    const msg = await p
    setTimeout(
        () => bot.deleteMessage(msg.chat.id, msg.message_id),
        5 * 60 * 1000,
    )
}

module.exports = {
    trimMessage,
    getDate,
    isEqualDays,
    deleteLater,
}
