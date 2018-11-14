const parseUsername = u => {
    let username = u.indexOf("@") == 0 ? u.substring(1) : u
    return {
        username: username.toLowerCase(),
        query: username,
        display: "@" + username,
    }
}

module.exports = parseUsername
