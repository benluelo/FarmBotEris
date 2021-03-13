import { Log } from "../../global"
import { FarmBotClient } from "../lib/FarmBotClient"

export default async (bot: FarmBotClient) => {
  bot.editStatus("online", {
    name: `farming in ${bot.guilds.size} servers!`,
    type: 0
  })
  setImmediate(() => {
    Log.connect("Bot Online!")
  })
}