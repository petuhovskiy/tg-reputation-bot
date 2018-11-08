const db = require("../db")
const bot = require("../bot")
const utils = require("../lib/utils")
const queue = require("../back/queue")
const inv = require('./invalidate')
const { revealLast10 } = require('./manage')

const handleCommand = (msg, cmd, action) => {
    const { text } = msg
    if (text && text.startsWith(cmd)) {
        action(msg.text, msg, cmd)
    }
}

const superhelp = (text, msg) => {
    bot.sendMessage(
        msg.chat.id,
        utils.trimMessage(`
            SuperHelp:

            /superhelp - display this
            /showallchats - show all chats info
            /invalidate - do something
            /reveal {chatid}
        `),
        {
            parse_mode: "HTML",
        }
    )
}

const showallchats = async (text, msg) => {
    const chats = await db.Message.distinct("chat")
    for (let i = 0; i < chats.length; i++) {
        const chat = chats[i]
        bot.sendMessage(
            msg.chat.id,
            `

<code>${JSON.stringify(chat, null, 4)}</code>
Messages count: ${await db.Message.count({ "chat.id": chat.id })}

        `,
            {
                parse_mode: "HTML",
            }
        )
    }
}

const invalidate = (text, msg) => {
    queue.add(async () => {
        await inv(msg.chat.id)
    })
}

const reveal = async (text, msg) => {
    let chatId
    try {
        const reg = /\/reveal ([^\s]+)/
        const result = reg.exec(text)
        if (!result) {
            return
        }
        chatId = parseInt(result[1])
    } catch (err) {
        console.log(err)
        return
    }

    revealLast10(chatId, msg.chat.id)
}

const handle = msg => {
    handleCommand(msg, "/superhelp", superhelp)
    handleCommand(msg, "/showallchats", showallchats)
    handleCommand(msg, "/invalidate", invalidate)
    handleCommand(msg, "/reveal", reveal)
}

module.exports = handle
