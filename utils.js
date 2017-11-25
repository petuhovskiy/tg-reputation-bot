module.exports = {
    trimMessage: (msg) =>
        msg.split('\n')
            .map(it => it.trim())
            .join('\n')
}