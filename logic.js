const db = require('./db')
const Activity = db.Activity;
const ReputationChange = db.ReputationChange;

const getDate = d => new Date(d).toDateString();

async function getTodayActivity(id) {
    const now = Date.now();
    let activity = await Activity.findByUserId(id);
    if (!activity) {
        activity = new Activity({
            id: id,
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

async function getReputation(chatId, username, change) {
    const rep = await ReputationChange.countReputation(username);
    return {
        chatId,
        reputation: {
            username,
            change,
            value: rep.plus * 10 - rep.minus * 15,
            plus: rep.plus,
            minus: rep.minus
        }
    };
}

async function setReputation(from, chatId, username, value) {
    if (from.username == username) {
        throw {chatId, limit: 3};
    }

    const checkActivity = act => {
        if (act.plus > 3) throw {chatId, limit: 1};
        if (act.minus > 1) throw {chatId, limit: 2};
        act.save();
    }

    const activity = await getTodayActivity(from.id);
    if (value == 1) {
        activity.plus += 1;
    } else if (value == -1) {
        activity.minus += 1;
    }

    let rep = await ReputationChange.findByUsers(from.id, username);
    if (rep == null) {
        checkActivity(activity);
        rep = new ReputationChange({
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