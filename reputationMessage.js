const utils = require('./utils')

const getForChange = (change) => {
    if (change > 0) return " увеличена!"
    if (change < 0) return " уменьшена!"
    return ""
}

module.exports = bot => msg => {
    if (msg.limit == 3) {
        bot.sendMessage(msg.chatId, utils.trimMessage(
            `Вы не можете менять свою репутацию!`
        ))
        return;
    }
    if (msg.limit) {
        bot.sendMessage(msg.chatId, utils.trimMessage(
            `Вы превысили лимит на сегодня!`
        ))
        return;
    }
    bot.sendMessage(msg.chatId, utils.trimMessage(
        `Репутация @${msg.reputation.username}${getForChange(msg.reputation.change)}
        Текущая репутация: <b>${msg.reputation.value}</b>
        
        <i>+${msg.reputation.plus} / -${msg.reputation.minus}</i>
        `
    ), {
        parse_mode: "HTML"
    });
}