import { FarmBotClient } from "./lib/FarmBotClient.js"
import { Message, MessageContent, MessageFile } from "eris"

Message.prototype.send = function (content: MessageContent, file: MessageFile): Promise<Message> {
  // @ts-ignore the fact that this still works proves otherwise
  return this._client.createMessage(this.channel.id, content, file)
}

import dotenv from "dotenv"
const dotenvParsed = dotenv.config()
if (dotenvParsed.parsed === undefined && dotenvParsed.error !== undefined) {
  throw dotenvParsed.error
}

const bot = new FarmBotClient(dotenvParsed.parsed!, {
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

import commandLoader from "./src/command-loader.js"
import eventLoader from "./src/event-loader.js"
// gonna turn that off for now
// require("../API/index")(bot) // not ideal (bot goes down so does some user pages) but works!
commandLoader(bot)
eventLoader(bot)

bot.initDB()

bot.connect()