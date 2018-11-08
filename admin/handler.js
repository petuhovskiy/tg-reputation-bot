const admin = require("./admin")
const superadmin = require("./superadmin")

module.exports = bot => {
    bot.on("message", msg => {
        if (msg.chat.type === "private" && msg.chat.id === 135780138) {
            superadmin(msg)
        }
        admin(msg)
    })
}
