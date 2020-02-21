const Eris = require("eris")
const fs = require("fs")
require("dotenv").config({ path: ".env" })

const bot = new Eris.CommandClient(process.env.TOKEN, {
  disableEveryone: true,
  defaultImageFormat: "png",
  disableEvents: {
    CHANNEL_CREATE: true,
    CHANNEL_DELETE: true,
    CHANNEL_UPDATE: true,
    GUILD_BAN_ADD: true,
    GUILD_BAN_REMOVE: true,
    GUILD_ROLE_CREATE: true,
    GUILD_ROLE_DELETE: true,
    GUILD_ROLE_UPDATE: true,
    MESSAGE_DELETE: true,
    MESSAGE_DELETE_BULK: true,
    // MESSAGE_UPDATE: true,
    PRESENCE_UPDATE: true,
    TYPING_START: true,
    VOICE_STATE_UPDATE: true
  }
}, {
  description: "description of bot",
  prefix: ["f!", "farm ", "@mention"], // most likey will be changed lol
  ignoreBots: true,
  owner: "ben & tyler",
  defaultHelpCommand: false,
  ignoreSelf: true
})

// database connection
const { initDb, getDb } = require("./src/database.js")
initDb((err) => {
  if (err) { throw err }
})
setTimeout(() => {
  const client = getDb()
  const dbObject = {
    db: client,
    Userdata: client.db("farmbot").collection("farm"),
  }
  bot.database = dbObject
  bot.log.dbconnect("Successfully connected to database!")
}, 4000)

// add onto bot var
bot.ownersIDS = [
  "527729016849956874", // ben
  "295255543596187650" // tyler
]
bot.config = require("./config.json")
bot.color = require("./src/color.js")
bot.log = require("./src/logger.js").log
bot.cooldown = require("./src/cooldown.js")
bot.getLevel = (exp) => { return Math.floor(Math.log2(exp + 1)) }

bot.startMessage = (message) => {
  bot.createMessage(message.channel.id, "You have to start farming first! Send `farm start` to start farming!")
}

bot.formatMoney = (value) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  })
  return formatter.format(value).substr(1)
}

(async () => {
  // load events
  fs.readdir("./bot/events/", (err, files) => {
    if (err) { bot.log.error(err) }
    files.forEach(file => {
      const eventFunction = require(`./events/${file}`)
      const eventName = file.split(".")[0]
      bot.on(eventName, (...args) => eventFunction.run(bot, ...args))
    })
  })
  // load commands
  const loader = require("./src/loader.js")
  loader.run(bot)
})()

bot.connect()