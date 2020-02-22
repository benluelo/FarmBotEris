const fs = require("fs")
const path = require("path")

/**
 * @param {import("../index.js").Bot} bot
 */
module.exports.run = (bot) => {
  loadCommands(bot, path.join(__dirname, "../commands"))
}

function loadCommands(bot, dirpath, depth = 0) {
  const p = dirpath
  fs.readdirSync(p).forEach((file, key, arr) => {
    if (!fs.lstatSync(`${p}/${file}`).isDirectory()) {
      require(`${p}/${file}`).run(bot)
      bot.log.commandLoad(Object.is(arr.length - 1, key) ? `${"│  ".repeat(depth)}└──⮞` : `${"│  ".repeat(depth)}├──⮞`, file)
    } else {
      bot.log.directoryLoad(`├──${"┼──".repeat(depth)}┬ Loading ${file} commands...`)
      loadCommands(bot, `${p}/${file}`, depth + 1)
    }
  })
}