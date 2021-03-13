import { FarmBotClient } from "../lib/FarmBotClient"

import fs from "fs"
import path from "path"
import Log from "./logger"

let helpLocation = ""

export default async (bot: FarmBotClient) => {
  loadCommands(bot, path.join(__dirname, "bot/commands"));
  (await import (helpLocation)).getHelp(bot)
}
/**
 * @description Load all of the commands found in `bot/commands`, recursively.
 * @param bot - The bot variable.
 * @param dirpath - The path to the current file.
 * @param depth - The depth of the recursion when looking for commands to load.
 */
function loadCommands(bot: FarmBotClient, dirpath: string, depth = 0) {
  const p = dirpath
  fs.readdirSync(p).forEach((file, key, arr) => {
    if (!fs.lstatSync(`${p}/${file}`).isDirectory()) {
      const [name, ext] = file.split(".")
      if (ext == "js") {
        if (name == "help") {
          if (helpLocation != "") {
            throw new Error(`Two commands/ subcommands share the name "help":\n  ${helpLocation}\n  ${`${p}/${file}`}`)
          }
          helpLocation = `${p}/${file}`
        }
        require(`${p}/${file}`).run(bot)
        Log.commandLoad(Object.is(arr.length - 1, key) ? `${"│  ".repeat(depth)}└──>` : `${"│  ".repeat(depth)}├──>`, file)
      }
    } else {
      Log.directoryLoad(`├──${"┼──".repeat(depth)}┬ Loading ${file} commands...`)
      loadCommands(bot, `${p}/${file}`, depth + 1)
    }
  })
}