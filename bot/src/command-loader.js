const fs = require("fs")
const path = require("path")

let helpLocation = ""

/** @private @param {import("../lib/FarmBotClient.js")} bot */
module.exports = (bot) => {
  loadCommands(bot, path.join(__dirname, "../commands"))
  require(helpLocation).getHelp(bot)
}
/**
 * @description Load all of the commands found in `bot/commands`, recursively.
 * @param {import("../lib/FarmBotClient.js")} bot - The bot variable.
 * @param {String} dirpath - The path to the current file.
 * @param {Number} depth - The depth of the recursion when looking for commands to load.
 */
function loadCommands(bot, dirpath, depth = 0) {
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
        bot.log.commandLoad(Object.is(arr.length - 1, key) ? `${"│  ".repeat(depth)}└──>` : `${"│  ".repeat(depth)}├──>`, file)
      }
    } else {
      bot.log.directoryLoad(`├──${"┼──".repeat(depth)}┬ Loading ${file} commands...`)
      loadCommands(bot, `${p}/${file}`, depth + 1)
    }
  })
}