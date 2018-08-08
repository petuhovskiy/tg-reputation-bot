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

const getStatsLine = (it, index) => {
    let secret = '';
    if (it.username === 'elena_city') {
        secret = ' 💎';
    }
    return `<b>${index + 1}.</b> @${it.username}${secret}\t\t<b>${showValue(it.value)}</b>\t\t=\t\t<i>+${it.plus} / -${it.minus}</i>`;
}

const getStatsMessage = (result, page) => {
    const arr = ['🔝Топ по репутации🔝'];
    if (page != 1) {
        arr[0] += ' (страница ' + page + ')';
    }
    for (let i = 0; i < result.length; i++) {
        arr.push(getStatsLine(result[i][0], result[i][1]));
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
    if (msg.limit == 6) {
        bot.sendMessage(msg.chatId,
            'Некорректный username!',
            {parse_mode: "HTML"}
        );
        return;
    }
    if (msg.type == 'stats') {
        bot.sendMessage(msg.chatId, getStatsMessage(msg.result, msg.page), {parse_mode: "HTML"});
        return;
    }
    bot.sendMessage(msg.chatId, getReputationInfo(msg.reputation), {parse_mode: "HTML"});
}