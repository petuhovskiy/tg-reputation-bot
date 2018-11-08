const db = require("../db")
const bot = require("../bot")
const utils = require("../lib/utils")
const queue = require("../back/queue")
const inv = require('./invalidate')
const { revealLast10 } = require('./manage')
const msgs = require('../front/msg')

const chatAdmins = {}

const handleCommand = (msg, cmd, action) => {
    const { text } = msg
    if (text && text.startsWith(cmd)) {
        action(msg.text, msg, cmd)
    }
}

const enableadmin = async (text, msg) => {
    console.log(JSON.stringify(msg, null, 4))
    const member = await bot.getChatMember(msg.chat.id, msg.from.id)
    console.log(JSON.stringify(member, null, 4))
    if (member.status !== "administrator" && member.status !== "creator") {
        bot.sendMessage(msg.chat.id, msgs.adminOnly())
        return
    }
    chatAdmins[msg.from.id] = msg.chat.id
    showStatus(msg.from.id)
    showLatest(msg.from.id)
}

const adminhelp = (text, msg) => {
    bot.sendHTML(msg.chat.id, msgs.helpAdmin())
}

const showStatus = id => {
    const chat = chatAdmins[id]
    if (!chat) {
        bot.sendHTML(id, msgs.adminStatusNoChat())
        return
    }
    bot.sendHTML(id, msgs.adminStatusChat(chat))
}

const showLatest = id => {
    const chatId = chatAdmins[id]
    if (!chatId) {
        bot.sendHTML(id, msgs.adminStatusNoChat())
        return
    }
    revealLast10(chatId, id)
}

const adminstatus = (text, msg) => {
    showStatus(msg.chat.id)
}

const latest = (text, msg) => {
    showLatest(msg.chat.id)
}

const cancel = (text, msg) => {
    let repId
    try {
        const reg = /\/cancel ([^\s]+)/
        const result = reg.exec(text)
        if (!result) {
            bot.sendHTML(msg.chat.id, msgs.adminNotParsed())
            return
        }
        repId = result[1]
    } catch (err) {
        bot.sendHTML(msg.chat.id, msgs.adminErrorCaught())
        console.log(err)
        return
    }

    queue.add(async () => {
        const chatId = chatAdmins[msg.chat.id]
        if (!chatId) {
            bot.sendHTML(id, msgs.adminStatusNoChat())
            return
        }

        const rep = await db.ReputationChange.findOne({
            _id: repId,
            chatId,
        })

        if (!rep) {
            bot.sendMessage(msg.chat.id, msgs.adminNotFound())
            return
        }

        await db.ReputationChange.remove({
            _id: repId,
            chatId,
        })

        bot.sendHTML(chatId, msgs.adminCanceled(msg.chat.id, rep))
        
        await inv()
    })
}

const handle = msg => {
    if (msg.chat.type !== "private") {
        handleCommand(msg, "/admin", enableadmin)
        return
    }

    handleCommand(msg, "/adminhelp", adminhelp)
    handleCommand(msg, "/adminstatus", adminstatus)
    handleCommand(msg, "/latest", latest)
    handleCommand(msg, "/cancel", cancel)
}

module.exports = handle
