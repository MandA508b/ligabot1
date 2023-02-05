const telegraf = require('telegraf')

const bot = new telegraf.Telegraf(`${process.env.BOT_TOKEN}`)

module.exports = bot