const utils = require('./utils')
const spliceString = require('splice-string')

const getForChange = (change) => {
    if (change > 0) return " увеличена 👍🏻!"
    if (change < 0) return " уменьшена 👎🏻!"
    return ""
}

const showValue = value => {
    if (value > 0) return '+' + value;
    return value;
}

const expand = (s, len) =>
    spliceString(s, s.lastIndexOf(' '), 0, ' '.repeat(Math.max(0, len - s.length)));

const getStatsLine = (it, index) =>
    `<b>${index + 1}.</b> @${it.username}\t\t<b>${showValue(it.value)}</b>`

const getStatsMessage = result => {
    const arr = ['🔝Топ по репутации🔝'];
    for (let i = 0; i < result.length; i++) {
        const tmp = {username: result[i]._id.username, value: result[i].value};
        arr.push(getStatsLine(tmp, i));
    }
    return arr.join('\n');
}

const getReputationInfo = reputation => 
    utils.trimMessage(
        `Репутация ${reputation.user.display}${getForChange(reputation.change)}
        Текущая репутация: <b>${reputation.value}</b>
        
        <i>+${reputation.plus} / -${reputation.minus}</i>
        `
    )

module.exports = bot => msg => {
    console.log(msg);
    if (msg.limit == 3) {
        bot.sendMessage(msg.chatId,
            `Вы не можете изменять <b>свою репутацию</b> ⛔️!`,
            {parse_mode: "HTML"}
        )
        return;
    }
    if (msg.limit == 4) {
        bot.sendMessage(msg.chatId,
            `<b>Сегодня</b> вы не можете изменять репутацию этому юзеру ⛔️!`,
            {parse_mode: "HTML"}
        )
        return;
    }
    if (msg.limit == 2) {
        bot.sendMessage(msg.chatId,
            `<b>Сегодня</b> вы не можете повышать репутацию ⛔️!`,
            {parse_mode: "HTML"}
        )
        return;
    }
    if (msg.limit == 1) {
        bot.sendMessage(msg.chatId,
            `<b>Сегодня</b> вы не можете понижать репутацию ⛔️!`,
            {parse_mode: "HTML"}
        )
        return;
    }
    if (msg.limit == 5) {
        bot.sendMessage(msg.chatId,
            'Вы не можете понижать репутацию с <b>репутацией ниже 5</b> ⛔️!',
            {parse_mode: "HTML"}
        )
        return;
    }
    if (msg.type == 'stats') {
        bot.sendMessage(msg.chatId, getStatsMessage(msg.result), {parse_mode: "HTML"});
        return;
    }
    bot.sendMessage(msg.chatId, getReputationInfo(msg.reputation), {parse_mode: "HTML"});
}