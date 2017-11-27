const utils = require('./utils')

const MOTTO = (process.env.MOTTO || " ")

module.exports = bot => {
    bot.on('message', msg => {
        const chatId = msg.chat.id
        if (msg.new_chat_member && msg.new_chat_member.username == process.env.BOT_USERNAME) {
            bot.sendMessage(
                chatId,
                utils.trimMessage(
                    `${MOTTO} 

                    Использование бота:
                    +rep @user - увеличить репутацию
                    -rep @user - уменьшить репутацию
                    ?rep @user - узнать репутацию
                    /repstats  - статистика чата
    
                    Увеличить репутацию можно не более трех раз в день.
                    Уменьшить репутацию можно не более одного раза в день.
                    Для уменьшения репутации нужно иметь репутацию >= 5.
                    `
                ),
                {
                    parse_mode: "HTML"
                }
            )
        }
    })
}