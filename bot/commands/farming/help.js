const help = require("../../lib/help-info.js")

/** @private @param {import("../../lib/FarmBotClient.js")} bot */
module.exports.run = (bot) => {
  bot.registerCommand("help", (message, args) => {
    bot.getUser(message.author.id, (err, userdata) => {

      if (err) { bot.log.error(err) }

      if (userdata) {
        if (!args[0]) { message.send(help.fullHelpEmbeds[userdata.permissions]) }
        else {
          const req = help.helpEmbeds[args[0]]
          if (req) { return message.send(req) }
          else { message.send(new bot.embed().uhoh(`${args[0]} isn't a command!`)) }
        }
      } else { bot.startMessage(message) }

    })
  }, bot.cooldown(1000))
}