const tmp = {};

async function getTodayChange(from) {
    
}

async function getReputation(chatId, username, change) {

    return {
        chatId,
        reputation: {
            username,
            change,
            value: tmp[chatId + '#' + username],
            plus: 4,
            minus: 1
        }
    };
}

async function setReputation(from, chatId, username, value) {


    if (!tmp[chatId + '#' + username]) tmp[chatId + '#' + username] = 0;
    tmp[chatId + '#' + username] = tmp[chatId + '#' + username] + value;
    return value;
}

module.exports = {
    getReputation,
    setReputation
}