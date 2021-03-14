import { FarmBotClient } from "../lib/FarmBotClient.js"
import Log from "../src/logger.js"

export function run(bot: FarmBotClient, message: string, id: number) {
  Log.default("Debug message:", message)
}