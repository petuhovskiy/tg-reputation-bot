const parseUsername = require("./front/parseUsename")
const db = require("./db")
const reputation = require("./back/reputation")
const msgs = require("./front/msg")

const methods = (chatId, from, username) => ({
    plus: () => reputation.plus(chatId, from, username),
    minus: () => reputation.minus(chatId, from, username),
    get: () => reputation.get(chatId, username),
})

const f = (msg, username) => {
    return methods(msg.chat.id, msg.from, parseUsername(username))
}

module.exports = bot => {
    const resp = require("./front")(bot)

    bot.onText(/\+rep ([@\w]+)/, (msg, match) =>
        f(msg, match[1])
            .plus()
            .then(resp, resp)
    )
    bot.onText(/-rep ([@\w]+)/, async (msg, match) => {
            const member = await bot.getChatMember(msg.chat.id, msg.from.id)
            if (member.status !== "administrator" && member.status !== "creator") {
                bot.sendMessage(msg.chat.id, msgs.adminOnly())
                return
            }
            f(msg, match[1])
                .minus()
                .then(resp, resp)
        }
    )
    bot.onText(/\?rep ([@\w]+)/, (msg, match) =>
        f(msg, match[1])
            .get()
            .then(resp, resp)
    )
    bot.onText(/\?rep$/, msg => {
        if (!msg.from.username) {
            bot.sendHTML(msg.chat.id, msgs.errorRequiredUsername())
            return
        }
        return f(msg, msg.from.username)
            .get()
            .then(resp, resp)
    })
    bot.onText(/\/repstats\s*(-?\d+)?/, (msg, match) =>
        reputation.showStats(msg.chat.id, parseInt(match[1])).then(resp, resp)
    )
    bot.onText(/\/rephelp/, msg => bot.sendHTML(msg.chat.id, msgs.helpBot()))
    bot.on("message", msg => db.saveMessage(msg))
}
