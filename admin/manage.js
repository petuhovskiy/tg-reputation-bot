const db = require("../db")
const bot = require("../bot")
const utils = require("../lib/utils")
const msgs = require("../front/msg")
const parseUsername = require("../front/parseUsename")
const logic = require("../back/logic")
const inv = require("./invalidate")

const revealLast10 = async (chatId, resp) => {
    const last = await db.ReputationChange.find({ chatId })
        .sort({ time: -1 })
        .limit(10)

    await bot.sendMessage(
        resp,
        `Последние ${last.length} события в чате ${chatId}:`
    )

    for (let i = 0; i < last.length; i++) {
        const rep = last[i]
        await bot.sendHTML(
            resp,
            `
${msgs.showRepChange(rep)}

<b>ID</b>: ${rep._id}
            `
        )
    }
}

const showRep = async (username, chatId, resp) => {
    const rep = await logic.getReputation(chatId, parseUsername(username))
    await bot.sendHTML(resp, msgs.getReputationInfo(rep.reputation))
}

const cancelRep = async (repId, chatId, resp) => {
    const rep = await db.ReputationChange.findOne({
        _id: repId,
        chatId,
    })

    if (!rep) {
        bot.sendMessage(resp, msgs.adminNotFound())
        return
    }

    await db.ReputationChange.remove({
        _id: repId,
        chatId,
    })

    await db.saveEvent({
        type: "delete",
        repId,
        chatId,
        admin: resp,
        rep: rep,
    })

    bot.sendHTML(chatId, msgs.adminCanceled(resp, rep))
    bot.sendHTML(resp, msgs.adminDone(resp))

    await inv()
}

const migrateRep = async (oldUsername, newUsername, chatId, resp) => {
    const old = parseUsername(oldUsername)
    const nw = parseUsername(newUsername)

    if (
        (await db.ReputationChange.count({
            chatId,
            username: nw.username,
        })) === 0
    ) {
        bot.sendHTML(resp, msgs.adminNotFoundUsername(username))
        return
    }

    const willUpdate = await db.ReputationChange.find({
        chatId,
        username: old.username,
    })

    await db.saveEvent({
        type: "updateUsername",
        oldUsername: old.username,
        newUsername: nw.username,
        chatId,
        admin: resp,
        updated: willUpdate,
    })

    await db.ReputationChange.updateMany(
        {
            chatId,
            username: old.username,
        },
        {
            $set: {
                username: nw.username,
            },
        }
    )

    bot.sendHTML(
        chatId,
        msgs.adminDoneMigration(
            resp,
            willUpdate.length,
            old.username,
            nw.username
        )
    )
    bot.sendHTML(
        resp,
        msgs.adminDoneMigration(
            resp,
            willUpdate.length,
            old.username,
            nw.username
        )
    )
    await inv()
}

module.exports = {
    revealLast10,
    showRep,
    cancelRep,
    migrateRep,
}
