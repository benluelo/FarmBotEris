const fs = require("fs")
const { join } = require("path")

/**
 * @param {import("../index.js").Bot} bot
 */
module.exports = (bot) => {
  fs.readdir(join(__dirname, "../events/"), (err, files) => {
    if (err) {
      bot.log.error(err)
    }
    files.forEach((file) => {
      const eventFunction = require(join(__dirname, `../events/${file}`))
      const eventName = file.split(".")[0]
      bot.on(eventName, (...args) => eventFunction.run(bot, ...args))
    })
  })
}