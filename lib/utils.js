const getDate = d => new Date(d).toDateString()

const isEqualDays = (a, b) => getDate(a) == getDate(b)

const trimMessage = msg =>
    msg
        .split("\n")
        .map(it => it.trim())
        .join("\n")

module.exports = {
    trimMessage,
    getDate,
    isEqualDays,
}
