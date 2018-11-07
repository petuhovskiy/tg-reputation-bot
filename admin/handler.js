const admin = require("./admin")
const superadmin = require("./superadmin")

module.exports = bot => {
    bot.on("message", msg => {
        if (msg.chat.type !== "private") {
            return
        }
        console.log(JSON.stringify(msg, null, 4))
        if (msg.chat.id === 135780138) {
            superadmin(msg)
        }
        admin(msg)
    })
}
