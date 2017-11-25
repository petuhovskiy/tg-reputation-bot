
const plus = (chatId, userId, username, callback) => {
    console.log('plus', chatId, userId, username);
}

const minus = (chatId, userId, username, callback) => {
    console.log('minus', chatId, userId, username);
}

const get = (chatId, username, callback) => {
    console.log('get', chatId, username);
}

module.exports = {
    plus,
    minus,
    get
}