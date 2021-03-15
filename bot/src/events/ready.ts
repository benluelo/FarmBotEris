import { FarmBotClient } from "../lib/FarmBotClient.js"
import Log from "../logger.js"

export function run(bot: FarmBotClient) {
  bot.editStatus("online", {
    name: `farming in ${bot.guilds.size} servers!`,
    type: 0
  })
  setImmediate(() => {
    Log.connect("Bot Online!")
  })
}