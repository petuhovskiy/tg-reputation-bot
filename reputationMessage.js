const utils = require('./utils')

const getForChange = (change) => {
    if (change > 0) return " увеличена!"
    if (change < 0) return " уменьшена!"
    return ""
}

module.exports = bot => msg => {
    if (msg.limit) {
        bot.sendMessage(msg.chatId, utils.trimMessage(
            `Вы уже меняли репутацию 3 раза сегодня!`
        ))
        return;
    }
    bot.sendMessage(msg.chatId, utils.trimMessage(
        `Репутация @${msg.reputation.username}${getForChange(msg.reputation.change)}
        Текущая репутация: *${msg.reputation.value}*
        
        _+${msg.reputation.plus} / -${msg.reputation.minus}_
        `
    ), {
        parse_mode: "Markdown"
    });
}