require("dotenv").config()

const bot = require("./bot")

require("./handler")(bot)
require("./front/join")(bot)
require("./admin/handler")(bot)

bot.on("polling_error", error => {
    console.log(error)
    console.log(error.code) // => 'EFATAL'
})
