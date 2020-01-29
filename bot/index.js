const Eris = require("eris")
const fs = require("fs")
// eslint-disable-next-line no-unused-vars
const chalk = require("chalk")
require("dotenv").config({ path: ".env" })

const bot = new Eris.CommandClient(process.env.TOKEN, {
  disableEveryone: true,
  defaultImageFormat: "png",
  // i dont know if you want this but it says "This can cause significant performance increase on large bots"
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
    MESSAGE_UPDATE: true,
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
  if (err) throw err
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
bot.plants = require("./lib/plants.json")

bot.cooldown = (length) => {
  const _cd = {
    cooldown: length,
    cooldownMessage: function() {
      return `cooldown is ${length/1000} seconds pls slow down`
    },
    cooldownExclusions: {
      channelIDs: [
        "669353094953435183" // dev stuff > #test-test
      ]
    }
  }
  return _cd
}

bot.startMessage = (message) => {
  bot.createMessage(message.channel.id, "You have to start farming first! Send `farm start` to start farming!")
}

const init = async () => {
  // load events
  fs.readdir("./bot/events/", (err, files) => {
    if (err) bot.log.error(err)
    files.forEach(file => {
      const eventFunction = require(`./events/${file}`)
      const eventName = file.split(".")[0]
      bot.on(eventName, (...args) => eventFunction.run(bot, ...args))
    })
  })
  // load commands
  const loader = require("./commands/meta/loader.js")
  loader.run(bot)
}
init()

bot.connect()