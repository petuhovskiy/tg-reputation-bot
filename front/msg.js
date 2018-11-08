const utils = require("../lib/utils")
const trim = utils.trimMessage
const MOTTO = process.env.MOTTO || " "

const msg = {
    getForChange: change => {
        if (change > 0) return " увеличена 👍🏻!"
        if (change < 0) return " уменьшена 👎🏻!"
        return ""
    },
    showValue: value => {
        if (value > 0) return "+" + value
        return value
    },
    getStatsLine: (it, index) => {
        let secret = ""
        if (it.username === "elena_city") {
            secret = " 💎"
        }
        return `<b>${index + 1}.</b> @${
            it.username
        }${secret}\t\t<b>${msg.showValue(it.value)}</b>\t\t=\t\t<i>+${
            it.plus
        } / -${it.minus}</i>`
    },
    getStatsMessage: (result, page) => {
        const arr = ["🔝Топ по репутации🔝"]
        if (page != 1) {
            arr[0] += " (страница " + page + ")"
        }
        for (let i = 0; i < result.length; i++) {
            arr.push(msg.getStatsLine(result[i][0], result[i][1]))
        }
        return arr.join("\n")
    },
    getReputationInfo: reputation =>
        trim(
            `Репутация ${reputation.user.display}${msg.getForChange(
                reputation.change
            )}
            Текущая репутация: <b>${reputation.value}</b>
            
            <i>+${reputation.plus} / -${reputation.minus}</i>
            `
        ),
    errorSelfLike: () => `Вы не можете изменять <b>свою репутацию</b> ⛔️!`,
    errorAlreadyLikedUser: () =>
        `<b>Сегодня</b> вы не можете изменять репутацию этому юзеру ⛔️!`,
    errorDailyUpLimit: () =>
        `<b>Сегодня</b> вы не можете повышать репутацию ⛔️!`,
    errroDailyDownLimit: () =>
        `<b>Сегодня</b> вы не можете понижать репутацию ⛔️!`,
    errorCantUp: () =>
        "Вы не можете понижать репутацию с <b>репутацией ниже 5</b> ⛔️!",
    errorInvalidUsername: () => "Некорректный username!",
    errorRequiredUsername: () =>
        "Вам нужно <b>поставить username</b> для того чтобы узнавать свою репутацию ⛔️!",
    helpBot: () =>
        trim(
            `${MOTTO} 

            Использование бота:
            +rep @user - увеличить репутацию
            -rep @user - уменьшить репутацию
            ?rep @user - узнать репутацию
            /repstats  - статистика чата
            /rephelp   - показать этот help

            Увеличить репутацию можно не более трех раз в день.
            Уменьшить репутацию можно не более одного раза в день.
            Для уменьшения репутации нужно иметь репутацию >= 5.`
        ),
    showRepChange: (rep) => `Изменение от <a href="tg://user?id=${
        rep.id
    }">юзера</a>:
Репутация @${rep.username} ${msg.getForChange(rep.value)}`,
    adminCanceled: (adm, rep) =>
        trim(
            `
            <a href="tg://user?id=${
                adm
            }">Админ</a> отменил изменение репутации:
            
            ${msg.showRepChange(rep)}
            `
        ),
    adminOnly: () => "Только администраторам чата доступна эта команда!",
    helpAdmin: () =>
        trim(
            `
            Admin help:

            /adminhelp - показать этот help
            /adminstatus - текущий статус
            /latest - последние 10 репутаций
            /cancel - отменить изменение репутации

            Использование:

            Написать /latest чтобы получить последние репутации.
            Скопировать ID нужной, который имеет вид 5b3df53ab52f390019a2bc17.
            После этого ее можно отменить командой:
            
            /cancel 5b3df53ab52f390019a2bc17
        `
        ),
    adminStatusNoChat: () => `Текущий статус: чат не выбран.`,
    adminStatusChat: chat => `Текущий статус: администрирование чата ${chat}`,
    adminNotParsed: () => "Ошибка в команде!",
    adminErrorCaught: () => "Ошибка в команде.",
    adminNotFound: () => `Не найдено`,
}
module.exports = msg
