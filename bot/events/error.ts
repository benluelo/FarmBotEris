import { FarmBotClient } from "../lib/FarmBotClient"
import Log from "../src/logger"

export default async (bot: FarmBotClient, err: Error, id: number) => {
  Log.error(err.stack + "\nShard ID: " + id)
}