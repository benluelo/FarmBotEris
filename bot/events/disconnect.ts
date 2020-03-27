import type { FarmBotClient } from "../lib/FarmBotClient"

export const run = (bot: FarmBotClient) => {
  bot.log.default("Bot Disconnected")
}