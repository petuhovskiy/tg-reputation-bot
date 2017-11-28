const db = require('./db')
const { ReputationChange, Reputation } = db

async function init() {
    const all = await ReputationChange.findAll();
    console.log('all records received');
    const users = {};
    for (let i = 0; i < all.length; ++i) {
        const obj = all[i];
        const { username, chatId, value } = obj;
        const token = username + '$' + chatId;
        if (!users[token]) {
            users[token] = {
                chatId,
                username,
                value: 0,
                plus: 0,
                minus: 0
            }
        }
        const user = users[token];
        if (value == 1) {
            user.value++;
            user.plus++;
        } else if (value == -1) {
            user.value--;
            user.minus++;
        }
    }
    console.log('all processed, updating db...');
    for (const token in users) {
        await (new Reputation(users[token]).save());
    }
    console.log('all done!');
    return null;
}

module.exports = {
    dbInit: init
}