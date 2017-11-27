const Queue = require('./queue')
const logic = require('./logic')
const queue = new Queue();

const plus = (chatId, from, username) => {
    return queue.add(() => 
        logic.setReputation(from, chatId, username, 1)
        .then(change => logic.getReputation(chatId, username, change))
    );
}

const minus = (chatId, from, username) => {
    return queue.add(() => 
        logic.setReputation(from, chatId, username, -1)
        .then(change => logic.getReputation(chatId, username, change))
    );
}

const get = (chatId, username) => {
    return queue.add(() => logic.getReputation(chatId, username));
}

const showStats = (chatId) => {
    return queue.add(() => logic.getStats(chatId));
}

module.exports = {
    plus,
    minus,
    get,
    showStats
}