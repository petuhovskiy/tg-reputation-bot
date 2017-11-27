const utils = require('./utils')
const db = require('./db')
const Activity = db.Activity;
const ReputationChange = db.ReputationChange;

const { getDate, isEqualDays } = utils

async function getTodayActivity(chatId, id) {
    const now = Date.now();
    let activity = await Activity.findByUserId(chatId, id);
    if (!activity) {
        activity = new Activity({
            id,
            chatId,
            minus: 0,
            plus: 0,
            last: now
        });
        await activity.save();
    } else if (getDate(activity.last) != getDate(now)) {
        activity.last = now;
        activity.minus = activity.plus = 0;
        await activity.save();
    } else {
        activity.last = now;
        await activity.save();
    }
    return activity;
}

const PLUS = 1;
const MINUS = 1;

async function getReputation(chatId, user, change) {
    const {username} = user;
    const rep = await ReputationChange.countReputation(chatId, username);
    return {
        chatId,
        reputation: {
            user,
            change,
            value: rep.plus * PLUS - rep.minus * MINUS,
            plus: rep.plus,
            minus: rep.minus
        }
    };
}

async function getStats(chatId) {
    const result = await db.ReputationChange.getStats(chatId, PLUS, MINUS, -1);
    return {
        chatId,
        type: 'stats',
        result
    }
}

const PLUS_LIMIT = parseInt(process.env.PLUS_LIMIT || '3')
const MINUS_LIMIT = parseInt(process.env.MINUS_LIMIT || '1')

async function setReputation(from, chatId, user, value) {
    const {username} = user;
    const fromUsername = (from.username ? from.username.toLowerCase() : null);
    if (fromUsername == username) {
        throw {chatId, limit: 3};
    }

    const checkActivity = act => {
        if (act.plus > PLUS_LIMIT) throw {chatId, limit: 2};
        if (act.minus > MINUS_LIMIT) throw {chatId, limit: 1};
    }

    const activity = await getTodayActivity(chatId, from.id);
    if (value == 1) {
        activity.plus += 1;
    } else if (value == -1) {
        activity.minus += 1;
        const err = {chatId, limit: 5};
        if (!fromUsername) throw err;
        const rep = await getReputation(chatId, {
            username: fromUsername,
            query: from.username,
            display: '@' + from.username
        });
        if (rep.reputation.value < 5) throw err;
    }

    const now = Date.now();

    let rep = await ReputationChange.findByUsers(chatId, from.id, username, value);
    if (rep == null || !isEqualDays(rep.time, now)) {
        checkActivity(activity);
        await activity.save();
        rep = new ReputationChange({
            chatId,
            id: from.id,
            username,
            value,
            time: now
        });
        await rep.save();
        return value;
    }

    throw {chatId, limit: 4}
}

module.exports = {
    getReputation,
    setReputation,
    getStats
}