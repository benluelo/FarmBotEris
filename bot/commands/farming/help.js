const help = require("../../lib/help-info.js")

/** @param {import("../../index.js").Bot} bot */
module.exports.run = (bot) => {
  bot.registerCommand("help", (message, args) => {
    if (!args[0]) {
      for (const e in help.fullHelpEmbeds) {
        bot.createMessage(message.channel.id, help.fullHelpEmbeds[e])
      }
    } else {
      const req = help.helpEmbeds[args[0]]
      if (req) {
        return bot.createMessage(message.channel.id, req)
      } else {
        bot.createMessage(message.channel.id, `${args[0]} isn't a command!`)
      }
    }
  }, bot.cooldown(15000))
}