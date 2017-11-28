require('dotenv').config()
const { dbInit } = require('./dbInit')

const TelegramBot = require('node-telegram-bot-api')

const token = process.env.BOT_TOKEN;

if (!token) {
    console.error('token is required!')
    process.exit(1)
}

// init
const bot = new TelegramBot(token, {polling: true})
bot.reputationMessage = require('./reputationMessage')(bot)

if (process.env.UPDATE_V1 == 'true') {
    dbInit();
} else {
    require('./reputationHandler')(bot)
    require('./joinMessage')(bot)
}