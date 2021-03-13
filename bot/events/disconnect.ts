import { FarmBotClient } from "../lib/FarmBotClient"
import Log from "../src/logger"

export default (bot: FarmBotClient) => {
  Log.default("Bot Disconnected")
}