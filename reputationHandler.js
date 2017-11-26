const reputation = require('./reputation')

const process = (chatId, from, username) => ({
    plus: () => reputation.plus(chatId, from, username),
    minus: () => reputation.minus(chatId, from, username),
    get: () => reputation.get(chatId, username)
})

const parseUsername = u => {
    if (u.indexOf('@') == 0) return u.substring(1);
    return u;
}

module.exports = bot => {

    const f = (msg, username) => {
        return process(msg.chat.id, msg.from, parseUsername(username));
    }

    const resp = bot.reputationMessage;

    bot.onText(/\+rep (.+)/, (msg, match) => f(msg, match[1]).plus().then(resp, resp));
    bot.onText(/-rep (.+)/, (msg, match) => f(msg, match[1]).minus().then(resp, resp));
    bot.onText(/\?rep (.+)/, (msg, match) => f(msg, match[1]).get().then(resp, resp));
    bot.onText(/\?rep$/, msg => {
        if (!msg.from.username) {
            bot.sendMessage("Вам нужно поставить username для того чтобы узнавать свою репутацию!");
            return;
        }
        return f(msg, msg.from.username).get().then(resp, resp);
    });
}