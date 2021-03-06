const utils = require("../lib/utils")
const db = require("../db")

const { Activity, ReputationChange, Reputation } = db
const { getDate, isEqualDays } = utils

async function getTodayActivity(chatId, id) {
    const now = Date.now()
    let activity = await Activity.findByUserId(chatId, id)
    if (!activity) {
        activity = new Activity({
            id,
            chatId,
            minus: 0,
            plus: 0,
            last: now,
        })
        await activity.save()
    } else if (getDate(activity.last) != getDate(now)) {
        activity.last = now
        activity.minus = activity.plus = 0
        await activity.save()
    } else {
        activity.last = now
        await activity.save()
    }
    return activity
}

const PLUS = 1
const MINUS = 1

async function getReputation(chatId, user, change) {
    const { username } = user
    const rep = (await Reputation.countReputation(chatId, username)) || {
        plus: 0,
        minus: 0,
        value: 0,
    }
    return {
        chatId,
        reputation: {
            user,
            change,
            value: rep.plus * PLUS - rep.minus * MINUS,
            plus: rep.plus,
            minus: rep.minus,
        },
    }
}

async function updateReputation(chatId, username, value) {
    const rep =
        (await Reputation.countReputation(chatId, username)) ||
        new Reputation({ chatId, username, value: 0, minus: 0, plus: 0 })
    rep.value += value
    if (value == 1) {
        rep.plus++
    } else {
        rep.minus++
    }
    await rep.save()
}

async function getStats(chatId, page) {
    const stats = (await db.Reputation.getStats(chatId, -1)).map(
        (it, index) => [it, index]
    )

    const PAGE_SIZE = 20

    const getPage = (arr, page) => {
        const shift = page > 0 ? (page - 1) * PAGE_SIZE : page * PAGE_SIZE
        return arr.slice(shift).slice(0, PAGE_SIZE)
    }

    return {
        chatId,
        type: "stats",
        result: getPage(stats, page),
        page,
    }
}

const EXTENDED_PLUS_LIMIT = parseInt(process.env.EXTENDED_PLUS_LIMIT || "5")
const PLUS_LIMIT = parseInt(process.env.PLUS_LIMIT || "3")
const MINUS_LIMIT = parseInt(process.env.MINUS_LIMIT || "1")

async function setReputation(from, chatId, user, value) {
    const { username } = user
    if (username.length == 0) {
        throw { chatId, limit: 6 }
    }
    const fromUsername = from.username ? from.username.toLowerCase() : null
    if (fromUsername == username) {
        throw { chatId, limit: 3 }
    }

    const actualRep = await getReputation(chatId, {
        username: fromUsername,
        query: from.username,
        display: "@" + from.username,
    })

    const checkActivity = act => {
        const actualPlusLimit = Math.min(
            10,
            3 + Math.max(0, actualRep.reputation.value / 50)
        )
        if (act.plus > actualPlusLimit) throw { chatId, limit: 2 }
        if (act.minus > MINUS_LIMIT) throw { chatId, limit: 1 }
    }

    const activity = await getTodayActivity(chatId, from.id)
    if (value == 1) {
        activity.plus += 1
    } else if (value == -1) {
        activity.minus += 1
        const err = { chatId, limit: 5 }
        if (!fromUsername) throw err
        if (actualRep.reputation.value < 5) throw err
    }

    const now = Date.now()

    let rep = await ReputationChange.findByUsers(
        chatId,
        from.id,
        username,
        value
    )
    if (rep == null || !isEqualDays(rep.time, now)) {
        checkActivity(activity)
        await activity.save()
        rep = new ReputationChange({
            chatId,
            id: from.id,
            username,
            value,
            time: now,
        })
        await updateReputation(chatId, username, value)
        await rep.save()
        return value
    }

    throw { chatId, limit: 4 }
}

module.exports = {
    getReputation,
    setReputation,
    getStats,
}
