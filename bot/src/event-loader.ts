import { FarmBotClient } from "../lib/FarmBotClient.js"

import fs from "fs"
import { join } from "path"
import Log from "./logger.js"

export default (bot: FarmBotClient) => {
  fs.readdir(join(__dirname, "../events/"), (err, files) => {
    if (err) {
      return Log.error(err)
    }
    files.forEach(async (file) => {
      const eventFunction = await import(join(__dirname, `../events/${file}`))
      const eventName = file.split(".")[0]
      bot.on(eventName, (...args: any[]) => eventFunction.run(bot, ...args))
    })
  })
}