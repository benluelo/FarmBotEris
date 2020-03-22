const FarmBotClient = require("./lib/FarmBotClient.js")
const { Message } = require("eris")
/**
 * @description Sends a message to the channel the message came from.
 * @param {String | Array | Object} content - A string, array of strings, or object. If an object is passed:
 * @param {String} content.content - A content string.
 * @param {Object} [content.embed] - An embed object. See [the official Discord API documentation entry](https://discordapp.com/developers/docs/resources/channel#embed-object) for object structure.
 * @param {Boolean} [content.tts] - Set the message TTS flag.
 * @param {Boolean} [content.disableEveryone] - Whether to filter @everyone/@here or not (overrides default).
 * @param {Object | Object[]} [file] - A file object (or an Array of them).
 * @param {Buffer} file.file - A buffer containing file data.
 * @param {String} file.name - What to name the file.
 * @returns {Promise<import("eris").Message>} - The message that was sent.
 */
Message.prototype.send = function (content, file) {
  return this._client.createMessage(this.channel.id, content, file)
}

/** @type {import("./lib/FarmBotClient.js")} */
const bot = new FarmBotClient(require("dotenv").config().parsed, {
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
}, [
  "farm",
  "f!"
])

require("./src/command-loader.js")(bot)
require("./src/event-loader.js")(bot)
require("../API/index")(bot) // not ideal (bot goes down so does some user pages) but works!

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