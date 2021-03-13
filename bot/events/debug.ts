import { Log } from "../../global"
import { FarmBotClient } from "../lib/FarmBotClient"

export default (bot: FarmBotClient, message: string, id: number) => {
  Log.default("Debug message:", message)
}