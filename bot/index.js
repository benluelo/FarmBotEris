const Eris = require("eris")
const fs = require("fs")
require("dotenv").config({ path: ".env" })

/**
 * @type {Bot}
 */
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
  prefix: ["f!", "farm ", "@mention"], // most likely will be changed lol
  ignoreBots: true,
  owner: "ben & tyler",
  defaultHelpCommand: false,
  ignoreSelf: true
})
exports.bot = bot

// database connection
require("./src/database.js")((err, db) => {
  if (err) { throw err }
  if (db) {
    const client = db
    const dbObject = {
      db: client,
      Userdata: client.db("farmbot").collection("farm"),
    }
    bot.database = dbObject
    bot.log.dbconnect("Successfully connected to database!")
  }
})

// add onto bot var
bot.ownersIDS = [
  "527729016849956874", // ben
  "295255543596187650" // tyler
]
bot.config = require("./config.json")
bot.color = require("./src/color.js")
bot.log = require("./src/logger.js")
bot.cooldown = require("./src/cooldown.js")

bot.formatMoney = require("./src/format-money.js")
bot.getUser = require("./src/get-user.js")

bot.startMessage = require("./src/start-message.js")

;(async () => {
  // load events
  fs.readdir("./bot/events/", (err, files) => {
    if (err) { bot.log.error(err) }
    files.forEach((file) => {
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

/**
 * @typedef {import("eris").CommandClient & BotVars} Bot
 */

/**
 * @typedef {Object} BotVars
 * @prop {Object} database
 * @prop {import("mongodb").MongoClient} database.db - the database
 * @prop {import("mongodb").Collection} database.Userdata - the userdata collection (`farmbot -> farm`)
 * @prop {import("./src/logger.js")} log - different ways to log stuff.
 * @prop {import("./src/format-money.js")} formatMoney - formats a monetary amount for sending in messages.
 * @prop {import("./src/get-user.js")} getUser
 * @prop {import("./src/cooldown")} cooldown
 * @prop {import("./src/color.js")} color - the different colors for the bot.
 * @prop {import("./src/start-message.js")} startMessage - the message to send when the user isn't in the database (i.e. hasn't started yet).
 */

/**
 * @type {BotVars}
 */
// const b = 4

new RegExp(/{.+&.+}/)