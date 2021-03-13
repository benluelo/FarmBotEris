import { FarmBotClient } from "../lib/FarmBotClient"
import Log from "../src/logger"

export default (bot: FarmBotClient, message: string, id: number) => {
  Log.default("Debug message:", message)
}