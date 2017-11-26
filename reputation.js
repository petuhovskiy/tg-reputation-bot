const Queue = require('./queue')
const logic = require('./logic')
const queue = new Queue();

const plus = (chatId, from, username) => {
    console.log('plus', chatId, from, username);
    return queue.add(() => 
        logic.setReputation(from, chatId, username, 1)
        .then(change => logic.getReputation(chatId, username, change))
    );
}

const minus = (chatId, from, username) => {
    console.log('minus', chatId, from, username);
    return queue.add(() => 
        logic.setReputation(from, chatId, username, -1)
        .then(change => logic.getReputation(chatId, username, change))
    );
}

const get = (chatId, username) => {
    console.log('get', chatId, username);
    return queue.add(() => logic.getReputation(chatId, username));
}

module.exports = {
    plus,
    minus,
    get
}