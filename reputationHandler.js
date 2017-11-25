const reputation = require('./reputation')

const process = (chatId, fromId, username, callback) => ({
    plus: () => reputation.plus(chatId, fromId, username, callback),
    minus: () => reputation.minus(chatId, fromId, username, callback),
    get: () => reputation.get(chatId, username, callback)
})

module.exports = bot => {

    const f = (msg, match) => {
        return process(msg.chat.id, msg.from.id, match[1], bot.reputationMessage);
    }

    bot.onText(/\+rep (.+)/, (msg, match) => f(msg, match).plus());
    bot.onText(/-rep (.+)/, (msg, match) => f(msg, match).minus());
    bot.onText(/\?rep (.+)/, (msg, match) => f(msg, match).get());
}