import { Log } from "../../global"
import { FarmBotClient } from "../lib/FarmBotClient"

export default async (bot: FarmBotClient, err: Error, id: number) => {
  Log.error(err.stack + "\nShard ID: " + id)
}