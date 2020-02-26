const help = require("../../lib/help-info.js")

/** @param {import("../../index.js").Bot} bot */
module.exports.run = (bot) => {
  bot.registerCommand("help", (message, args) => {
    bot.getUser(message.author.id, (err, userdata) => {

      if (err) { bot.log.error(err) }

      if (userdata) {
        if (!args[0]) { message.send(help.fullHelpEmbeds[userdata.permissions]) }
        else {
          const req = help.helpEmbeds[args[0]]
          if (req) { return message.send(req) }
          else { message.send(`${args[0]} isn't a command!`) }
        }
      } else { bot.startMessage(message) }

    })
  }, bot.cooldown(15000))
}