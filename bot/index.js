const FarmBotClient = require("./lib/FarmBotClient.js")
require("dotenv").config({ path: ".env" })

/** @type {import("./lib/FarmBotClient.js")} */
const bot = new FarmBotClient(process.env.TOKEN, {
  disableEveryone: true,
  defaultImageFormat: "png",
  disableEvents: {
    CHANNEL_DELETE: true,
    CHANNEL_UPDATE: true,
    GUILD_BAN_ADD: true,
    GUILD_BAN_REMOVE: true,
    GUILD_ROLE_CREATE: true,
    GUILD_ROLE_DELETE: true,
    GUILD_ROLE_UPDATE: true,
    MESSAGE_DELETE: true,
    MESSAGE_DELETE_BULK: true,
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

require("./src/command-loader.js")(bot)
require("./src/event-loader.js")(bot)

bot.initDB()

bot.connect()

// const express = require("express")
// const app = express()
// const port = 3000

// app.get("/", (req, res) => res.send("Hello World!"))

// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// app.post("/", function (req, res) {
//   res.send("Got a POST request")
// })

// app.use(express.static(require("path").join(__dirname)))

// console.log(__dirname)