const db = require('./db')
const Activity = db.Activity;
const ReputationChange = db.ReputationChange;

const getDate = d => new Date(d).toDateString();

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

async function getReputation(chatId, user, change) {
    const {username} = user;
    const rep = await ReputationChange.countReputation(chatId, username);
    return {
        chatId,
        reputation: {
            user,
            change,
            value: rep.plus * 10 - rep.minus * 15,
            plus: rep.plus,
            minus: rep.minus
        }
    };
}

const PLUS_LIMIT = parseInt(process.env.PLUS_LIMIT || '3')
const MINUS_LIMIT = parseInt(process.env.MINUS_LIMIT || '1')

async function setReputation(from, chatId, user, value) {
    const {username} = user;
    if (from.username.toLowerCase() == username) {
        throw {chatId, limit: 3};
    }

    const checkActivity = act => {
        if (act.plus > PLUS_LIMIT) throw {chatId, limit: 1};
        if (act.minus > MINUS_LIMIT) throw {chatId, limit: 2};
        act.save();
    }

    const activity = await getTodayActivity(chatId, from.id);
    if (value == 1) {
        activity.plus += 1;
    } else if (value == -1) {
        activity.minus += 1;
    }

    let rep = await ReputationChange.findByUsers(chatId, from.id, username);
    if (rep == null) {
        checkActivity(activity);
        rep = new ReputationChange({
            chatId,
            id: from.id,
            username,
            value
        });
        await rep.save();
        return value;
    }

    if (value == rep.value) {
        return 0;
    }

    checkActivity(activity);

    const result = value - rep.value;
    rep.value = value;
    await rep.save();
    return result;
}

module.exports = {
    getReputation,
    setReputation
}