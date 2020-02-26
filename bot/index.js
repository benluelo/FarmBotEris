const FarmBotClient = require("./lib/FarmBotClient.js")
require("dotenv").config({ path: ".env" })

/** @type {import("./lib/FarmBotClient.js")} */
const bot = new FarmBotClient(process.env.TOKEN, {
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

// add onto bot var
bot.ownersIDs = require("./config.json").ownersIDs
bot.config = require("./config.json")
bot.embed = require("./lib/classes").Embed

require("./src/command-loader.js")(bot)
require("./src/event-loader.js")(bot)

bot.initDB()

bot.connect()