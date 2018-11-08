const TelegramBot = require("node-telegram-bot-api")

const token = process.env.BOT_TOKEN
if (!token) {
    console.error("token is required!")
    process.exit(1)
}

// init
const bot = new TelegramBot(token, { polling: true })

bot.sendHTML = (id, html) => {
    return bot.sendMessage(id, html, { parse_mode: "HTML" })
}

module.exports = bot
