const utils = require('./utils')

module.exports = bot => {
    bot.on('message', msg => {
        const chatId = msg.chat.id
        if (msg.new_chat_member && msg.new_chat_member.username == process.env.BOT_USERNAME) {
            bot.sendMessage(
                chatId,
                utils.trimMessage(
                    `Использование бота:
                    +rep @user - увеличить репутацию
                    -rep @user - уменьшить репутацию
                    ?rep @user - узнать репутацию
    
                    Можно изменять репутацию не больше трех раз в день!
                    `
                )
            )
        }
    })
}