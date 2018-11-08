const db = require("../db")
const bot = require("../bot")
const utils = require("../lib/utils")

const invalidate = async (id) => {
    const log = s => {
        if (id) {
            bot.sendMessage(id, s, { parse_mode: "HTML" })
        }
        console.log(s)
    }

    log("Invalidation started")

    const remall = await db.Reputation.deleteMany({})
    log(`<code>${JSON.stringify(remall, null, 4)}</code>`)

    const all = await db.ReputationChange.findAll()
    log("All fetched")

    const users = {}
    for (let i = 0; i < all.length; ++i) {
        const obj = all[i]
        const { username, chatId, value } = obj
        const token = username + "$" + chatId
        if (!users[token]) {
            users[token] = {
                chatId,
                username,
                value: 0,
                plus: 0,
                minus: 0,
            }
        }
        const user = users[token]
        if (value == 1) {
            user.value++
            user.plus++
        } else if (value == -1) {
            user.value--
            user.minus++
        }
    }
    log("All calculated, storing in db")
    for (const token in users) {
        await new db.Reputation(users[token]).save()
    }

    log("Invalidation finished")
}

module.exports = invalidate;