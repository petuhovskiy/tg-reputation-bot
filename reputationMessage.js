const utils = require('./utils')
const spliceString = require('splice-string')

const getForChange = (change) => {
    if (change > 0) return " увеличена!"
    if (change < 0) return " уменьшена!"
    return ""
}

const showValue = value => {
    if (value > 0) return '+' + value;
    return value;
}

const expand = (s, len) =>
    spliceString(s, s.lastIndexOf(' '), 0, ' '.repeat(Math.max(0, len - s.length)));

const getStatsLine = (it, index) =>
    `<b>${index + 1}.</b> @${it.username}\t\t${showValue(it.value)}`

const getStatsMessage = result => {
    const arr = [];
    for (let i = 0; i < result.length; i++) {
        const tmp = {username: result[i]._id.username, value: result[i].value};
        arr.push(getStatsLine(tmp, i), 24);
    }
    return arr.join('\n');
}

module.exports = bot => msg => {
    console.log(msg);
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
    if (msg.type == 'stats') {
        bot.sendMessage(msg.chatId, getStatsMessage(msg.result), {
            parse_mode: "HTML"
        });
        return;
    }
    bot.sendMessage(msg.chatId, utils.trimMessage(
        `Репутация ${msg.reputation.user.display}${getForChange(msg.reputation.change)}
        Текущая репутация: <b>${msg.reputation.value}</b>
        
        <i>+${msg.reputation.plus} / -${msg.reputation.minus}</i>
        `
    ), {
        parse_mode: "HTML"
    });
}